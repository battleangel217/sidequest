from django.urls import path
from .views import CommunityViews

urlpatterns = [
    path('', CommunityViews.as_view(), name="communities")
]