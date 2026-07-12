from django.urls import path
from .views import LeaderboardView, RewardRedeemView

urlpatterns = [
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('rewards/<int:pk>/redeem/', RewardRedeemView.as_view(), name='redeem-reward'),
]