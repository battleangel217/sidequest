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
            firstname = id_info.get('given_name', '')
            lastname = id_info.get('family_name', '')

            user, created = User.objects.get_or_create(email=email)
            if created:
                user.set_unusable_password()
                user.username = f"{firstname}{lastname}{str(uuid.uuid4())[:4]}"
                user.email = email
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