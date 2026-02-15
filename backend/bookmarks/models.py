from django.db import models
from django.core.validators import URLValidator, MaxLengthValidator


class Bookmark(models.Model):
    url = models.URLField(max_length=2000)
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=500, blank=True, default="")
    tags = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
