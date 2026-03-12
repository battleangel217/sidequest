from django.urls import path
from .views import GoogleSignupViews

urlpatterns = [
    path('google', GoogleSignupViews.as_view(), name="google")
]