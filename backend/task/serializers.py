from rest_framework import serializers
from .models import TaskInventoryModel, TaskModel
from django.contrib.auth import get_user_model

User = get_user_model()


class TaskSerializer(serializers.ModelSerializer):
    submission_status = serializers.SerializerMethodField()
    community = serializers.CharField(source='community_id.name', read_only=True)

    class Meta:
        model = TaskModel
        fields = '__all__'

    def get_submission_status(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            submission = obj.submissions.filter(user=request.user).first()
            if submission:
                return submission.status
        return None

class SubmissionUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class TaskSubmissionSerializer(serializers.ModelSerializer):
    user = SubmissionUserSerializer(read_only=True)
    task = TaskSerializer(read_only=True)

    class Meta:
        model = TaskInventoryModel
        fields = ['id', 'user', 'task', 'status', 'proof_text', 'proof_image', 'proof_video', 'submitted_at', 'updated_at']


class TaskInventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskInventoryModel
        fields = '__all__'