from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import UserProfile

class LeaderboardView(APIView):
    """Returns employee rankings ordered by highest XP[cite: 1]"""
    def get(self, request):
        profiles = UserProfile.objects.select_related('user').order_by('-xp')[:10]
        leaderboard_data = [
            {
                "username": p.user.username,
                "xp": p.xp,
                "points": p.points_balance
            } for p in profiles
        ]
        return Response(leaderboard_data, status=status.HTTP_200_OK)

class RewardRedeemView(APIView):
    """Triggers reward redemption checking logic[cite: 1]"""
    def post(self, request, pk):
        try:
            reward = Reward.objects.get(pk=pk)
            redemption = RewardRedemption(user=request.user, reward=reward)
            redemption.save()
            return Response({"message": "Redemption successful!"}, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Reward.DoesNotExist:
            return Response({"error": "Reward not found"}, status=status.HTTP_404_NOT_FOUND)