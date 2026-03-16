from django.urls import path
from .views import CompletedTask, TaskViews, SubmitProofView, CommunitySubmissionsView, ReviewSubmissionView, PendingTask
urlpatterns = [
    path('submit/<int:task_id>/', SubmitProofView.as_view(), name='submit_proof'),
    path('submissions/<str:community_id>/', CommunitySubmissionsView.as_view(), name='community_submissions'),
    path('review/<int:submission_id>/', ReviewSubmissionView.as_view(), name='review_submission'),
    path('pending/', PendingTask.as_view(), name='pending_tasks'),
    path('completed/', CompletedTask.as_view(), name='completed_tasks'),
    path('<str:community_id>/', TaskViews.as_view(), name='task_views'),
]