from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Project, Membership

User = get_user_model()


class MembershipSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Membership
        fields = ("id", "user", "username", "role", "joined_at")
        read_only_fields = ("joined_at",)


class ProjectSerializer(serializers.ModelSerializer):
    members_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ("id", "name", "key", "description", "owner", "members_count", "created_at")
        read_only_fields = ("owner", "created_at")

    def get_members_count(self, obj):
        return obj.memberships.count()

    def create(self, validated_data):
        request = self.context["request"]
        project = Project.objects.create(owner=request.user, **validated_data)
        Membership.objects.create(project=project, user=request.user, role="owner")
        return project


class AddMemberSerializer(serializers.Serializer):
    username = serializers.CharField()
    role = serializers.ChoiceField(choices=Membership.ROLE_CHOICES, default="member")

    def validate_username(self, value):
        try:
            self.user = User.objects.get(username=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("No user with that username.")
        return value
