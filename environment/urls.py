from rest_framework.routers import DefaultRouter
from .views import EnvironmentalViewSet

router = DefaultRouter()
router.register(r'environment', EnvironmentalViewSet,basename='environment')

urlpatterns = router.urls