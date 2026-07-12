from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import EnvironmentalData
from .serializers import EnvironmentalSerializer


class EnvironmentalViewSet(viewsets.ModelViewSet):
    queryset = EnvironmentalData.objects.all()
    serializer_class = EnvironmentalSerializer