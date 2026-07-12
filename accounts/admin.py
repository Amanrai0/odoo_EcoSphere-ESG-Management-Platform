from django.contrib import admin

# Register your models here.
from .models import UserProfile

from django.contrib import admin
from .models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "role",
        "company",
    )

    list_filter = (
        "role",
    )