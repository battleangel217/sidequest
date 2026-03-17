from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.auth.transport import requests as google_request
from google.oauth2 import id_token
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import CustomUserSerializer
from django.conf import settings
import uuid
from rest_framework.permissions import IsAuthenticated
from datetime import timedelta
from django.utils import timezone

User = get_user_model()

# Create your views here.


class GoogleSignupViews(APIView):
    def post(self, request):
        token = request.data.get('token')

        if not token:
            return Response({"error":"Token not provided", "status":False}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            req = google_request.Request()
            try:
                id_info = id_token.verify_oauth2_token(token, req, settings.GOOGLE_OAUTH_CLIENT_ID)
            except Exception as e:
                return Response({"error": "Token verification failed", "details": str(e)}, status=400)

            email = id_info['email']
            firstname = id_info.get('given_name', 'user')
            lastname = id_info.get('family_name', '')

            # Generate unique username for new users
            username_base = f"{firstname.lower()}{lastname.lower()}"
            # Remove non-alphanumeric characters
            username_clean = "".join(c for c in username_base if c.isalnum()) 
            new_username = f"{username_clean}{str(uuid.uuid4())[:8]}"

            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': new_username,
                    'is_active': True 
                }
            )

            if created:
                user.set_unusable_password()
                user.save()
            elif not user.is_active:
                # If user existed but was inactive (e.g. pending email verification),
                # verifying via Google should activate them.
                user.is_active = True
                user.save()

            serializer = CustomUserSerializer(user)

            refresh = RefreshToken.for_user(user)
            return Response({
                    "refresh":str(refresh),
                    "access":str(refresh.access_token),
                    "data": serializer.data
            }, status=status.HTTP_200_OK)
        
        except ValueError:
            return Response({"error":"Invalid token"}, status=status.HTTP_400_BAD_REQUEST)



class UserView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user

        # Streak logic: If user hasn't completed a task yesterday or today, the streak is broken (0)
        # But we only reset it for display purposes here.
        today = timezone.now().date()
        if user.last_activity_data:
            last_activity_date = user.last_activity_data.date()
            # If last activity was before yesterday, streak is broken
            if last_activity_date < today - timedelta(days=1):
                if user.streak > 0:
                    user.streak = 0
                    user.save()
        
        # Calculate weekly breakdown
        from task.models import TaskInventoryModel
        
        start_of_week = today - timedelta(days=today.weekday())
        end_of_week = start_of_week + timedelta(days=6)
        
        completed_tasks = TaskInventoryModel.objects.filter(
            user=user,
            status='approved',
            updated_at__date__gte=start_of_week,
            updated_at__date__lte=end_of_week
        ).select_related('task')
        
        weekly_data = {day: 0 for day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
        days_map = {0: 'Mon', 1: 'Tue', 2: 'Wed', 3: 'Thu', 4: 'Fri', 5: 'Sat', 6: 'Sun'}
        
        for submission in completed_tasks:
            # updated_at is in UTC, convert to local time if needed, but for now use default timezone
            # Ideally use timezone.localtime(submission.updated_at)
            local_updated_at = timezone.localtime(submission.updated_at)
            day_name = days_map[local_updated_at.weekday()]
            weekly_data[day_name] += submission.task.exp_reward
            
        weekly_chart_data = [{'day': day, 'exp': exp} for day, exp in weekly_data.items()]

        serializer = CustomUserSerializer(user)
        data = serializer.data
        data['weekly_breakdown'] = weekly_chart_data
        return Response(data, status=status.HTTP_200_OK)