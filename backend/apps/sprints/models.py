from django.db import models

from apps.projects.models import Project


class Sprint(models.Model):
    STATUS_CHOICES = (
        ("planned", "Planned"),
        ("active", "Active"),
        ("completed", "Completed"),
    )

    project = models.ForeignKey(Project, related_name="sprints", on_delete=models.CASCADE)
    name = models.CharField(max_length=120)
    goal = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="planned")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-start_date"]

    def __str__(self):
        return f"{self.project.key} - {self.name}"
