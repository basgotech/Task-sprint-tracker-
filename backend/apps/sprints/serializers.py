from rest_framework import serializers

from .models import Sprint


class SprintSerializer(serializers.ModelSerializer):
    committed_points = serializers.SerializerMethodField()
    completed_points = serializers.SerializerMethodField()
    task_count = serializers.SerializerMethodField()

    class Meta:
        model = Sprint
        fields = (
            "id", "project", "name", "goal", "start_date", "end_date",
            "status", "created_at", "committed_points", "completed_points", "task_count",
        )
        read_only_fields = ("created_at",)

    def get_committed_points(self, obj):
        return sum(t.story_points for t in obj.tasks.all())

    def get_completed_points(self, obj):
        return sum(t.story_points for t in obj.tasks.all() if t.is_done)

    def get_task_count(self, obj):
        return obj.tasks.count()


class VelocityPointSerializer(serializers.Serializer):
    sprint_id = serializers.IntegerField()
    sprint_name = serializers.CharField()
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    committed_points = serializers.IntegerField()
    completed_points = serializers.IntegerField()
