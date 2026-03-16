from django.db import models
from community.models import CommunityModel
from django.contrib.auth import get_user_model
from cloudinary.models import CloudinaryField

User = get_user_model()

# Create your models here.

TYPE_CHOICES = (
    ('daily', 'daily'),
    ('weekly', 'weekly'),
)

STATUS_CHOICES = (
    ('available', 'available'),
    ('pending', 'pending'),
    ('completed', 'completed'),
    ('overdue', 'overdue'),
)


class TaskModel(models.Model):
    community_id = models.ForeignKey(CommunityModel, on_delete=models.CASCADE, related_name="tasks")
    title = models.CharField(max_length=100)
    description = models.TextField()
    exp_reward = models.PositiveIntegerField()
    task_type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    due_time = models.DateTimeField(null=True,blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    created_at = models.DateTimeField(auto_now_add=True)


class TaskInventoryModel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='task_submissions')
    task = models.ForeignKey(TaskModel, on_delete=models.CASCADE, related_name='submissions')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    proof_text = models.TextField(blank=True, default='')
    proof_image = CloudinaryField('proof_image', blank=True, null=True)
    proof_video = CloudinaryField('proof_video', blank=True, null=True, resource_type='video')
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
