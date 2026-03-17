from django.urls import path
from .views import CommunityViews, CommunityDetailsViews, JoinCommunityView

urlpatterns = [
    path('', CommunityViews.as_view(), name="communities"),
    path('<str:community_id>/', CommunityDetailsViews.as_view(), name="community-details"),
    path('<str:community_id>/join/', JoinCommunityView.as_view(), name="join-community"),
]