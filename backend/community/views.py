from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CommunitySerializer
from .models import MembershipModel, CommunityModel
from rest_framework.permissions import IsAuthenticated

# Create your views here.


from django.db.models import Q

class CommunityViews(APIView):
    # permission_classes = [IsAuthenticated]
    def get(self, request):
        # Allow user to see public communities OR communities they are a member of
        data = CommunityModel.objects.filter(Q(is_private=False) | Q(members=request.user)).distinct()
        serializer = CommunitySerializer(data, many=True, context={'request': request})

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        serializer = CommunitySerializer(data=data, context={'request': request})

        if serializer.is_valid():
            community_instance = serializer.save(created_by=request.user)
            MembershipModel.objects.create(
                user=request.user,
                community=community_instance,
                role="admin"
            )
            
            # Re-serialize to get the membership data (including rank)
            return Response(CommunitySerializer(community_instance, context={'request': request}).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommunityDetailsViews(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, community_id):
        data = get_object_or_404(CommunityModel, id=community_id)
        serializer = CommunitySerializer(data, context={'request': request})

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, community_id):
        community = get_object_or_404(CommunityModel, id=community_id)

        if community.created_by != request.user:
            return Response({"error": "Only the community creator can delete this community"}, status=status.HTTP_403_FORBIDDEN)

        community.delete()
        return Response({"message": "Community deleted successfully"}, status=status.HTTP_200_OK)