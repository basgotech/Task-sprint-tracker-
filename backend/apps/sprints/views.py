from django.db.models import Sum, Case, When, IntegerField
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Sprint
from .serializers import SprintSerializer, VelocityPointSerializer


class SprintViewSet(viewsets.ModelViewSet):
    serializer_class = SprintSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Sprint.objects.filter(project__memberships__user=self.request.user).distinct()
        project_id = self.request.query_params.get("project")
        if project_id:
            qs = qs.filter(project_id=project_id)
        return qs

    @action(detail=False, methods=["get"])
    def velocity(self, request):
        """Team velocity: committed vs completed story points, last N completed/active sprints."""
        project_id = request.query_params.get("project")
        limit = int(request.query_params.get("limit", 8))
        qs = self.get_queryset().exclude(status="planned")
        if project_id:
            qs = qs.filter(project_id=project_id)

        sprints = qs.order_by("-start_date")[:limit]
        data = []
        for sprint in reversed(list(sprints)):
            agg = sprint.tasks.aggregate(
                committed=Sum("story_points"),
                completed=Sum(
                    Case(
                        When(is_done=True, then="story_points"),
                        default=0,
                        output_field=IntegerField(),
                    )
                ),
            )
            data.append(
                {
                    "sprint_id": sprint.id,
                    "sprint_name": sprint.name,
                    "start_date": sprint.start_date,
                    "end_date": sprint.end_date,
                    "committed_points": agg["committed"] or 0,
                    "completed_points": agg["completed"] or 0,
                }
            )
        return Response(VelocityPointSerializer(data, many=True).data)
