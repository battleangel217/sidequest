import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.

def generate_id():
    return str(uuid.uuid4())[:8]

class CommunityModel(models.Model):
    id = models.CharField(max_length=8, primary_key=True, default=generate_id, editable=False)
    name = models.CharField(max_length=50, null=False)
    description = models.TextField()
    members = models.ManyToManyField(User, through="MembershipModel")
    is_private = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_communities")
    community_exp = models.PositiveIntegerField(default=0)


class MembershipModel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    community = models.ForeignKey(CommunityModel, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, default="member")
    community_exp = models.PositiveIntegerField(default=0)
    weekly_exp = models.PositiveIntegerField(default=0)
    joined_at = models.DateTimeField(auto_now_add=True)