from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from notification.serializers import NotificationSerializer
from notification.models import NotificationModel
from community.models import CommunityModel, MembershipModel

User = get_user_model()


class SendInviteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        user = get_object_or_404(User, email=data['email'])
        community_id = data.get('community_id', '')

        NotificationModel.objects.create(
            user=user,
            type='invite',
            title=data['title'],
            message=data['message'],
            related_id=community_id,
        )

        return Response({"message": "Invite sent successfully"}, status=status.HTTP_200_OK)


class RespondInviteView(APIView):
    """Accept or reject a community invite from a notification."""
    permission_classes = [IsAuthenticated]

    def post(self, request, notification_id):
        notification = get_object_or_404(
            NotificationModel, id=notification_id, user=request.user, type='invite'
        )

        action = request.data.get('action')
        if action not in ['accept', 'reject']:
            return Response(
                {"error": "Action must be 'accept' or 'reject'"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if action == 'accept':
            community_id = notification.related_id
            if not community_id:
                return Response(
                    {"error": "No community linked to this invite"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                community = CommunityModel.objects.get(id=community_id)
            except CommunityModel.DoesNotExist:
                return Response(
                    {"error": "Community no longer exists"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Check if already a member
            if MembershipModel.objects.filter(user=request.user, community=community).exists():
                notification.is_read = True
                notification.save()
                return Response(
                    {"message": "You are already a member of this community"},
                    status=status.HTTP_200_OK,
                )

            MembershipModel.objects.create(
                user=request.user,
                community=community,
                role='member',
            )

            notification.is_read = True
            notification.save()

            return Response(
                {"message": f"You have joined {community.name}!"},
                status=status.HTTP_200_OK,
            )

        else:
            # Reject — just mark as read
            notification.is_read = True
            notification.save()

            return Response(
                {"message": "Invite declined"},
                status=status.HTTP_200_OK,
            )
