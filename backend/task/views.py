from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import TaskSerializer, TaskSubmissionSerializer
from .models import TaskModel, TaskInventoryModel
from rest_framework.permissions import IsAuthenticated
from datetime import timedelta
from django.utils import timezone
from community.models import CommunityModel
from community.models import MembershipModel
from notification.models import NotificationModel


class TaskViews(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, community_id):
        data = request.data.copy()

        if data.get("task_type") == "daily":
            data["due_time"] = (timezone.now() + timedelta(days=1)).isoformat()
        elif data.get("task_type") == "weekly":
            data["due_time"] = (timezone.now() + timedelta(days=7)).isoformat()

        data["community_id"] = community_id

        serializer = TaskSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Task created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, community_id):
        if not CommunityModel.objects.filter(id=community_id).exists():
             return Response({"error": "Community not found"}, status=status.HTTP_404_NOT_FOUND)
             
        tasks = TaskModel.objects.filter(community_id=community_id, status='available')
        serializer = TaskSerializer(tasks, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class SubmitProofView(APIView):
    """Allows a user to submit proof for a task."""
    permission_classes = [IsAuthenticated]

    def post(self, request, task_id):
        try:
            task = TaskModel.objects.get(id=task_id)
        except TaskModel.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

        # Check if user already submitted for this task
        existing = TaskInventoryModel.objects.filter(user=request.user, task=task).first()
        if existing and existing.status == 'pending':
            return Response({"error": "You already have a pending submission for this task"}, status=status.HTTP_400_BAD_REQUEST)

        proof_text = request.data.get('proof_text', '')
        proof_image = request.FILES.get('proof_image', None)
        proof_video = request.FILES.get('proof_video', None)

        submission = TaskInventoryModel.objects.create(
            user=request.user,
            task=task,
            status='pending',
            proof_text=proof_text,
            proof_image=proof_image,
            proof_video=proof_video,
        )

        return Response({
            "message": "Proof submitted successfully",
            "submission_id": submission.id,
        }, status=status.HTTP_201_CREATED)


class CommunitySubmissionsView(APIView):
    """Admin endpoint to list all pending submissions for a community."""
    permission_classes = [IsAuthenticated]

    def get(self, request, community_id):
        try:
            community = CommunityModel.objects.get(id=community_id)
        except CommunityModel.DoesNotExist:
            return Response({"error": "Community not found"}, status=status.HTTP_404_NOT_FOUND)

        if str(community.created_by.id) != str(request.user.id):
            return Response({"error": "Only the community admin can review submissions"}, status=status.HTTP_403_FORBIDDEN)

        status_filter = request.query_params.get('status', 'pending')
        submissions = TaskInventoryModel.objects.filter(
            task__community_id=community,
            status=status_filter
        ).select_related('user', 'task').order_by('-submitted_at')

        serializer = TaskSubmissionSerializer(submissions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ReviewSubmissionView(APIView):
    """Admin endpoint to approve or reject a submission."""
    permission_classes = [IsAuthenticated]

    def patch(self, request, submission_id):
        try:
            submission = TaskInventoryModel.objects.select_related('task__community_id').get(id=submission_id)
        except TaskInventoryModel.DoesNotExist:
            return Response({"error": "Submission not found"}, status=status.HTTP_404_NOT_FOUND)

        community = submission.task.community_id
        if str(community.created_by.id) != str(request.user.id):
            return Response({"error": "Only the community admin can review submissions"}, status=status.HTTP_403_FORBIDDEN)

        new_status = request.data.get('status')
        if new_status not in ['approved', 'rejected']:
            return Response({"error": "Status must be 'approved' or 'rejected'"}, status=status.HTTP_400_BAD_REQUEST)

        submission.status = new_status
        submission.save()

        leveled_up = False
        # If approved, mark the original task as completed for this user
        if new_status == 'approved':
            submission.task.status = 'completed'
            submission.task.save()

            # Add exp to user
            submission.user.exp += submission.task.exp_reward
            leveled_up = submission.user.update_level()
            submission.user.save()

            # Add exp to community member
            try:
                member = MembershipModel.objects.get(user=submission.user, community=community)
                member.community_exp += submission.task.exp_reward
                member.weekly_exp += submission.task.exp_reward
                member.save()
            except MembershipModel.DoesNotExist:
                pass


            NotificationModel.objects.create(
                user=submission.user,
                type='approval',
                title="Task Approved!",
                message=f"Your submission for '{submission.task.title}' has been approved! You've earned {submission.task.exp_reward} EXP.{' Level Up!' if leveled_up else ''}",
                related_id=submission.id
            )


            
            # Add exp to community
            community.community_exp += submission.task.exp_reward
            community.save()

            # Update User Streak
            user = submission.user
            now = timezone.now()
            today = now.date()
            if user.last_activity_data:
                last_activity_date = user.last_activity_data.date()
            else:
                last_activity_date = (today - timedelta(days=2)) # Force reset if None

            if last_activity_date == today:
                # Already active today
                if user.streak == 0:
                    user.streak = 1
                    if user.streak > user.best_streak:
                        user.best_streak = user.streak
            elif last_activity_date == today - timedelta(days=1):
                # Consecutive day
                user.streak += 1
                if user.streak > user.best_streak:
                    user.best_streak = user.streak
            else:
                # Broken streak
                user.streak = 1
                if user.streak > user.best_streak: # e.g. if best was 0
                    user.best_streak = max(user.best_streak, 1)

            user.last_activity_data = now
            user.save()

        return Response({
            "message": f"Submission {new_status} successfully",
            "submission_id": submission.id,
            "status": new_status,
            "new_streak": submission.user.streak if new_status == 'approved' else None,
            "new_level": submission.user.level if new_status == 'approved' else None,
            "leveled_up": leveled_up,
        }, status=status.HTTP_200_OK)


class PendingTask(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tasks = TaskInventoryModel.objects.filter(user=request.user, status='pending')
        serializer = TaskSubmissionSerializer(tasks, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class CompletedTask(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tasks = TaskInventoryModel.objects.filter(user=request.user, status='approved')
        serializer = TaskSubmissionSerializer(tasks, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)