from django.urls import path
from .views import ESGScoreAPIView

urlpatterns = [
    path(
        "esg-score/<int:company_id>/",
        ESGScoreAPIView.as_view(),
        name="esg-score",
    ),
]