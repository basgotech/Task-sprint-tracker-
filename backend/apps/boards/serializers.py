from rest_framework import serializers

from .models import Board, Column, Task


class TaskSerializer(serializers.ModelSerializer):
    assignee_username = serializers.CharField(source="assignee.username", read_only=True, default=None)

    class Meta:
        model = Task
        fields = (
            "id", "project", "sprint", "column", "title", "description",
            "assignee", "assignee_username", "reporter", "priority",
            "story_points", "order", "is_done", "created_at", "updated_at",
        )
        read_only_fields = ("reporter", "created_at", "updated_at")

    def create(self, validated_data):
        validated_data["reporter"] = self.context["request"].user
        return super().create(validated_data)


class ColumnSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = Column
        fields = ("id", "board", "name", "order", "wip_limit", "tasks")


class BoardSerializer(serializers.ModelSerializer):
    columns = ColumnSerializer(many=True, read_only=True)

    class Meta:
        model = Board
        fields = ("id", "project", "name", "columns", "created_at")
        read_only_fields = ("created_at",)


class TaskMoveSerializer(serializers.Serializer):
    column = serializers.IntegerField()
    order = serializers.IntegerField(min_value=0)
