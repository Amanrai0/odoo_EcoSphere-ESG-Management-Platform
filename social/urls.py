from rest_framework.routers import DefaultRouter
from .views import SocialViewSet

router = DefaultRouter()
router.register(r'social', SocialViewSet)

urlpatterns = router.urls