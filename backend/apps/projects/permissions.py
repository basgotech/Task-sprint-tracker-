from rest_framework import permissions


class IsProjectMember(permissions.BasePermission):
    """Grants access only to users who belong to the project (via any related object)."""

    def has_object_permission(self, request, view, obj):
        project = getattr(obj, "project", obj)
        return project.memberships.filter(user=request.user).exists()


class IsProjectAdminOrOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        project = getattr(obj, "project", obj)
        return project.memberships.filter(
            user=request.user, role__in=["owner", "admin"]
        ).exists()
