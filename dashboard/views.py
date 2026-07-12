from django.db.models import Avg, Sum
from rest_framework.views import APIView
from rest_framework.response import Response

from companies.models import Company
from environment.models import EnvironmentalData
from social.models import SocialData
from governance.models import GovernanceData
from rest_framework.permissions import IsAuthenticated


class DashboardAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        total_companies = Company.objects.count()

        total_environment = EnvironmentalData.objects.count()
        total_social = SocialData.objects.count()
        total_governance = GovernanceData.objects.count()

        total_co2 = (
            EnvironmentalData.objects.aggregate(
                total=Sum("co2_emissions")
            )["total"] or 0
        )

        total_water = (
            EnvironmentalData.objects.aggregate(
                total=Sum("water")
            )["total"] or 0
        )

        total_electricity = (
            EnvironmentalData.objects.aggregate(
                total=Sum("electricity")
            )["total"] or 0
        )

        average_satisfaction = (
            SocialData.objects.aggregate(
                avg=Avg("employee_satisfaction")
            )["avg"] or 0
        )

        average_compliance = (
            GovernanceData.objects.aggregate(
                avg=Avg("compliance_score")
            )["avg"] or 0
        )

        data = {
            "total_companies": total_companies,
            "environment_records": total_environment,
            "social_records": total_social,
            "governance_records": total_governance,

            "total_co2_emissions": total_co2,
            "total_water_consumption": total_water,
            "total_electricity": total_electricity,

            "average_employee_satisfaction": round(average_satisfaction, 2),
            "average_compliance_score": round(average_compliance, 2),
        }

        return Response(data)