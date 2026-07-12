from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Company
from .serializers import CompanySerializer


from accounts.permissions import IsManager


class CompanyViewSet(viewsets.ModelViewSet):

    permission_classes = [IsManager]

    queryset = Company.objects.all()
    serializer_class = CompanySerializer
