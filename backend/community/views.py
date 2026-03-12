from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CommunitySerializer
from .models import MembershipModel, CommunityModel
from rest_framework.permissions import IsAuthenticated

# Create your views here.


from django.db.models import Q

class CommunityViews(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # Allow user to see public communities OR communities they are a member of
        data = CommunityModel.objects.filter(Q(is_private=False) | Q(members=request.user)).distinct()
        serializer = CommunitySerializer(data, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        serializer = CommunitySerializer(data=data)

        if serializer.is_valid():
            community_instance = serializer.save()
            MembershipModel.objects.create(
                user=request.user,
                community=community_instance,
                role="admin"
            )

            return Response({"message":"Community created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
