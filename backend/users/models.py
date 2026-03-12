from django.db import models
from django.contrib.auth.models import AbstractUser
import random

# Create your models here.

def random_avatar():
    return f'https://api.dicebear.com/7.x/adventurer/svg?seed={random.random()}'


class CustomUserModel(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(unique=True)
    level = models.IntegerField(default=1)
    exp = models.IntegerField(default=0)
    streak = models.IntegerField(default=0)
    best_streak = models.IntegerField(default=0)
    last_activity_data = models.DateTimeField(auto_now_add=True)
    avatar = models.URLField(max_length=100, default=random_avatar)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []