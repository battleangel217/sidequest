from django.urls import path
from .views import CommunityViews, CommunityDetailsViews

urlpatterns = [
    path('', CommunityViews.as_view(), name="communities"),
    path('<str:community_id>/', CommunityDetailsViews.as_view(), name="community-details")
]