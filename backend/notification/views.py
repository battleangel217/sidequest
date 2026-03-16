from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import NotificationSerializer
from .models import NotificationModel
from rest_framework.permissions import IsAuthenticated

# Create your views here.


class NotificationViews(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        data = NotificationModel.objects.filter(user=request.user)
        serializer = NotificationSerializer(data, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        data = request.data

        if data["type"] == "read":
            notification = NotificationModel.objects.filter(id=data['id'], user=request.user).first()

            if not notification:
                return Response({"message": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)

            notification.is_read = True
            notification.save()
        elif data["type"] == "read_all":
            notification = NotificationModel.objects.filter(user=request.user, is_read=False)

            for n in notification:
                n.is_read = True
                n.save()

        return Response({"message": "Notification marked as read"}, status=status.HTTP_200_OK)