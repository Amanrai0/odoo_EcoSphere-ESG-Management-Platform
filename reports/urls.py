from django.urls import path
from .views import generate_report

urlpatterns = [
    path(
        "report/<int:company_id>/",
        generate_report,
        name="report",
    ),
]