from .models import CustomUserModel
from rest_framework import serializers
from djoser.serializers import UserSerializer, UserCreateSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ("email", "username", "password")

    def create(self, validate_data):
        email = validate_data.get('email')
        username = validate_data.get("username")

        email = email.strip() if email else None

        if not email or not username:
            raise serializers.ValidationError("You must provide email and username")
        
        user = CustomUserModel(
            email=email,
            username=username,
        )
        user.set_password(validate_data['password'])
        user.save()

        return user
    

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
        


class CustomUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = User
        fields = ("id", "username", "email", "level", "exp", "streak", "best_streak", "last_activity_data", "avatar")
        read_only_fields = ("id", "username", "email", "avatar")


class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = User.objects.get(pk=self.user.id)
        serializer= CustomUserSerializer(user)
        data.update(
            {'data': serializer.data})
        return data