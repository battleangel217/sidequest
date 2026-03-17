from .models import CustomUserModel
from rest_framework import serializers
from djoser.serializers import UserSerializer, UserCreateSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from djoser.conf import settings as djoser_settings

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
            is_active=not djoser_settings.SEND_ACTIVATION_EMAIL
        )
        user.set_password(validate_data['password'])
        user.save()

        return user
    

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
        


class CustomUserSerializer(UserSerializer):
    community_count = serializers.SerializerMethodField()
    weekly_total = serializers.SerializerMethodField()

    class Meta(UserSerializer.Meta):
        model = User
        fields = ("id", "username", "email", "level", "exp", "streak", "best_streak", "last_activity_data", "avatar", "community_count", "weekly_total")
        read_only_fields = ("id", "username", "email", "avatar", "community_count", "weekly_total")
    
    def get_community_count(self, obj):
        from community.models import MembershipModel
        return MembershipModel.objects.filter(user=obj).count()

    def get_weekly_total(self, obj):
        from community.models import MembershipModel
        from django.db.models import Sum
        result = MembershipModel.objects.filter(user=obj).aggregate(Sum('weekly_exp'))
        return result['weekly_exp__sum'] or 0


class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = User.objects.get(pk=self.user.id)
        serializer= CustomUserSerializer(user)
        data.update(
            {'data': serializer.data})
        return data