from django.contrib import admin
from django.urls import include, path
from django.views.generic import RedirectView

urlpatterns = [
    path('', RedirectView.as_view(url='http://127.0.0.1:5173/', permanent=False)),
    path('admin/', admin.site.urls),
    path('api/v1/', include('governance.urls')),
]
