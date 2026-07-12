from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.dashboard), path('policies/', views.policies),
    path('policies/<int:policy_id>/acknowledge/', views.acknowledge),
    path('compliance-issues/', views.issues), path('compliance-issues/<int:issue_id>/', views.update_issue),
    path('jobs/escalate-overdue/', views.escalation_job), path('notifications/', views.notifications),
]
