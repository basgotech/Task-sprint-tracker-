from django.conf import settings
from django.db import models

from apps.projects.models import Project


class Board(models.Model):
    project = models.OneToOneField(Project, related_name="board", on_delete=models.CASCADE)
    name = models.CharField(max_length=120, default="Main Board")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.project.key} board"


class Column(models.Model):
    board = models.ForeignKey(Board, related_name="columns", on_delete=models.CASCADE)
    name = models.CharField(max_length=60)
    order = models.PositiveIntegerField(default=0)
    wip_limit = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.board} / {self.name}"


class Task(models.Model):
    PRIORITY_CHOICES = (
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
        ("urgent", "Urgent"),
    )

    project = models.ForeignKey(Project, related_name="tasks", on_delete=models.CASCADE)
    sprint = models.ForeignKey(
        "sprints.Sprint", related_name="tasks", null=True, blank=True, on_delete=models.SET_NULL
    )
    column = models.ForeignKey(Column, related_name="tasks", on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    assignee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="assigned_tasks",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )
    reporter = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="reported_tasks", on_delete=models.CASCADE
    )
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default="medium")
    story_points = models.PositiveSmallIntegerField(default=0)
    order = models.PositiveIntegerField(default=0)
    is_done = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["column", "order"]

    def __str__(self):
        return self.title
