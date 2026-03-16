from django.urls import path
from .views import GoogleSignupViews, UserView

urlpatterns = [
    path('google', GoogleSignupViews.as_view(), name="google"),
    path('me', UserView.as_view(), name="user_info"),
]