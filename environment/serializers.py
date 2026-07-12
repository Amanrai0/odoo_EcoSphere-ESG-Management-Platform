from rest_framework import serializers
from .models import EnvironmentalData


class EnvironmentalSerializer(serializers.ModelSerializer):

    class Meta:
        model = EnvironmentalData
        fields = "__all__"