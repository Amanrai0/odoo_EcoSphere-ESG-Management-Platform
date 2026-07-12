from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import SocialData
from .serializers import SocialSerializer


class SocialViewSet(viewsets.ModelViewSet):
    queryset = SocialData.objects.all()
    serializer_class = SocialSerializer