from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Project, Membership
from .permissions import IsProjectMember, IsProjectAdminOrOwner
from .serializers import ProjectSerializer, MembershipSerializer, AddMemberSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(memberships__user=self.request.user).distinct()

    def get_permissions(self):
        if self.action in ("update", "partial_update", "destroy", "add_member", "remove_member"):
            return [permissions.IsAuthenticated(), IsProjectAdminOrOwner()]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=True, methods=["get"])
    def members(self, request, pk=None):
        project = self.get_object()
        return Response(MembershipSerializer(project.memberships.all(), many=True).data)

    @action(detail=True, methods=["post"], url_path="members/add")
    def add_member(self, request, pk=None):
        project = self.get_object()
        serializer = AddMemberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        membership, created = Membership.objects.get_or_create(
            project=project,
            user=serializer.user,
            defaults={"role": serializer.validated_data["role"]},
        )
        if not created:
            return Response({"detail": "User is already a member."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(MembershipSerializer(membership).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"], url_path="members/remove")
    def remove_member(self, request, pk=None):
        project = self.get_object()
        user_id = request.data.get("user")
        Membership.objects.filter(project=project, user_id=user_id).exclude(role="owner").delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
