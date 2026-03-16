from django.urls import path
from .views import SendInviteView, RespondInviteView

urlpatterns = [
    path('send', SendInviteView.as_view(), name='send_invite'),
    path('respond/<int:notification_id>/', RespondInviteView.as_view(), name='respond_invite'),
]