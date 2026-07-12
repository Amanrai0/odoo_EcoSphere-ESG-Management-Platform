from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.userprofile.role == "ADMIN"
        )


class IsManager(BasePermission):

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.userprofile.role in ["ADMIN", "MANAGER"]
        )


class IsViewer(BasePermission):

    def has_permission(self, request, view):
        return request.user.is_authenticated