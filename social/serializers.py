from rest_framework import serializers
from .models import SocialData


class SocialSerializer(serializers.ModelSerializer):

    class Meta:
        model = SocialData
        fields = "__all__"