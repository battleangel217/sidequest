from .views import NotificationViews
from django.urls import path

urlpatterns = [
    path('', NotificationViews.as_view(), name='notification_views'),
]