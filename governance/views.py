from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets
from .models import GovernanceData
from .serializers import GovernanceSerializer


class GovernanceViewSet(viewsets.ModelViewSet):
    queryset = GovernanceData.objects.all()
    serializer_class = GovernanceSerializer
    