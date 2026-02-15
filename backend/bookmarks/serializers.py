from rest_framework import serializers
from .models import Bookmark


class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = ["id", "url", "title", "description", "tags", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_url(self, value):
        """Ensure the URL is valid."""
        if not value:
            raise serializers.ValidationError("URL is required.")
        return value

    def validate_title(self, value):
        """Ensure title is present and within limits."""
        if not value or not value.strip():
            raise serializers.ValidationError("Title is required.")
        if len(value) > 200:
            raise serializers.ValidationError("Title must be at most 200 characters.")
        return value.strip()

    def validate_description(self, value):
        """Ensure description is within limits."""
        if value and len(value) > 500:
            raise serializers.ValidationError(
                "Description must be at most 500 characters."
            )
        return value or ""

    def validate_tags(self, value):
        """Ensure tags are lowercase strings, max 5."""
        if not isinstance(value, list):
            raise serializers.ValidationError("Tags must be an array of strings.")
        if len(value) > 5:
            raise serializers.ValidationError("Maximum 5 tags allowed.")
        cleaned = []
        for tag in value:
            if not isinstance(tag, str):
                raise serializers.ValidationError("Each tag must be a string.")
            cleaned.append(tag.strip().lower())
        return cleaned
