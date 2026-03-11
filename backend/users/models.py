from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class CustomUserModel(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(unique=True)
    level = models.IntegerField(default=1)
    exp = models.IntegerField(default=0)
    streak = models.IntegerField(default=0)
    best_streak = models.IntegerField(default=0)
    last_activity_data = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []