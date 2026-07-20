from django.db import transaction
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Board, Column, Task
from .serializers import BoardSerializer, ColumnSerializer, TaskSerializer, TaskMoveSerializer

DEFAULT_COLUMNS = ["Backlog", "To Do", "In Progress", "In Review", "Done"]


class BoardViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Board.objects.filter(project__memberships__user=self.request.user).distinct()

    @transaction.atomic
    def perform_create(self, serializer):
        board = serializer.save()
        Column.objects.bulk_create(
            [Column(board=board, name=name, order=i) for i, name in enumerate(DEFAULT_COLUMNS)]
        )


class ColumnViewSet(viewsets.ModelViewSet):
    serializer_class = ColumnSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Column.objects.filter(board__project__memberships__user=self.request.user).distinct()
        board_id = self.request.query_params.get("board")
        if board_id:
            qs = qs.filter(board_id=board_id)
        return qs


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Task.objects.filter(project__memberships__user=self.request.user).distinct()
        project_id = self.request.query_params.get("project")
        sprint_id = self.request.query_params.get("sprint")
        if project_id:
            qs = qs.filter(project_id=project_id)
        if sprint_id:
            qs = qs.filter(sprint_id=sprint_id)
        return qs

    @action(detail=True, methods=["post"])
    def move(self, request, pk=None):
        """Move a task to a new column/position (used by kanban drag-and-drop)."""
        task = self.get_object()
        serializer = TaskMoveSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        column = Column.objects.filter(
            id=serializer.validated_data["column"], board__project=task.project
        ).first()
        if not column:
            return Response({"detail": "Invalid column."}, status=status.HTTP_400_BAD_REQUEST)

        new_order = serializer.validated_data["order"]
        with transaction.atomic():
            siblings = list(
                Task.objects.filter(column=column).exclude(pk=task.pk).order_by("order")
            )
            siblings.insert(new_order, task)
            for index, sibling in enumerate(siblings):
                Task.objects.filter(pk=sibling.pk).update(order=index, column=column)
            task.refresh_from_db()

        return Response(TaskSerializer(task).data)
