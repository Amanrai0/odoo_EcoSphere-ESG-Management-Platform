from rest_framework import serializers
from .models import GovernanceData


class GovernanceSerializer(serializers.ModelSerializer):

    class Meta:
        model = GovernanceData
        fields = "__all__"