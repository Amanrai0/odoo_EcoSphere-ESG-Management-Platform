from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response

from companies.models import Company
from environment.models import EnvironmentalData
from social.models import SocialData
from governance.models import GovernanceData

from .services import calculate_esg


class ESGScoreAPIView(APIView):

    def get(self, request, company_id):

        year = request.GET.get("year")
        month = request.GET.get("month")

        company = Company.objects.get(id=company_id)

        environment = EnvironmentalData.objects.get(
            company=company,
            year=year,
            month=month
        )

        social = SocialData.objects.get(
            company=company,
            year=year,
            month=month
        )

        governance = GovernanceData.objects.get(
            company=company,
            year=year,
            month=month
        )

        scores = calculate_esg(
            environment,
            social,
            governance
        )

        data = {
            "company": company.name,
            "year": year,
            "month": month,
            **scores
        }

        return Response(data)