from rest_framework import serializers
from .models import CommunityModel, MembershipModel
from users.serializers import CustomUserSerializer


class MembershipSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = MembershipModel
        fields = ['user', 'role', 'community_exp', 'weekly_exp', 'joined_at']


class CommunitySerializer(serializers.ModelSerializer):
    # Use the related name for the reverse relationship from CommunityModel to MembershipModel
    members = serializers.SerializerMethodField()
    admin_id = serializers.ReadOnlyField(source='created_by.id')
    user_rank = serializers.SerializerMethodField()

    class Meta:
        model = CommunityModel
        fields = ["id", "name", "description", "is_private", "created_at", "created_by", "admin_id", "members", "user_rank"]
        read_only_fields = ("id", "created_at", "members", "admin_id", "created_by", "user_rank")

    def get_members(self, obj):
        memberships = obj.membershipmodel_set.all().order_by('-community_exp')
        return MembershipSerializer(memberships, many=True).data

    def get_user_rank(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                membership = obj.membershipmodel_set.get(user=request.user)
                # Count how many members have more exp than the current user
                rank = obj.membershipmodel_set.filter(community_exp__gt=membership.community_exp).count() + 1
                return rank
            except MembershipModel.DoesNotExist:
                return None
        return None