from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Bookmark
from .serializers import BookmarkSerializer


class BookmarkViewSet(viewsets.ModelViewSet):
    """
    CRUD ViewSet for Bookmarks.
    Supports filtering by tag via ?tag=value query parameter.
    """

    serializer_class = BookmarkSerializer

    def get_queryset(self):
        queryset = Bookmark.objects.all()
        tag = self.request.query_params.get("tag")
        if tag:
            # Filter bookmarks whose tags array contains the given tag
            # Using icontains for SQLite compatibility
            queryset = queryset.filter(tags__icontains=tag.lower())
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
