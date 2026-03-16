from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.

NOTIFICATION_TYPE_CHOICES = (
    ('invite', 'invite'),
    ('approval', 'approval'),
    ('rejection', 'rejection'),
    ('streak_warning', 'streak_warning'),
)


class NotificationModel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=50, choices=NOTIFICATION_TYPE_CHOICES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    related_id = models.CharField(max_length=255, blank=True, null=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)