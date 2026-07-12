from rest_framework.routers import DefaultRouter
from .views import GovernanceViewSet

router = DefaultRouter()
router.register(r'governance', GovernanceViewSet)

urlpatterns = router.urls