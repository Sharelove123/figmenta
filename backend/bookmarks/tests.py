from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import Bookmark


class BookmarkListCreateTests(TestCase):
    """Tests for GET /api/bookmarks/ and POST /api/bookmarks/"""

    def setUp(self):
        self.client = APIClient()
        self.bookmark_data = {
            "url": "https://example.com",
            "title": "Example Site",
            "description": "An example bookmark",
            "tags": ["example", "test"],
        }
        # Create a sample bookmark for GET tests
        Bookmark.objects.create(
            url="https://seed.com",
            title="Seed Bookmark",
            description="A seeded bookmark",
            tags=["seed"],
        )

    def test_list_bookmarks(self):
        """GET /api/bookmarks/ should return 200 and a list of bookmarks."""
        response = self.client.get("/api/bookmarks/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertEqual(len(response.data), 1)

    def test_filter_by_tag(self):
        """GET /api/bookmarks/?tag=seed should return only matching bookmarks."""
        Bookmark.objects.create(
            url="https://other.com", title="Other", tags=["other"]
        )
        response = self.client.get("/api/bookmarks/?tag=seed")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Seed Bookmark")

    def test_create_bookmark_success(self):
        """POST /api/bookmarks/ with valid data should return 201."""
        response = self.client.post(
            "/api/bookmarks/", self.bookmark_data, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "Example Site")
        self.assertEqual(Bookmark.objects.count(), 2)

    def test_create_bookmark_missing_url(self):
        """POST /api/bookmarks/ without URL should return 400."""
        data = {"title": "No URL"}
        response = self.client.post("/api/bookmarks/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_bookmark_invalid_url(self):
        """POST /api/bookmarks/ with invalid URL should return 400."""
        data = {"url": "not-a-url", "title": "Bad URL"}
        response = self.client.post("/api/bookmarks/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_bookmark_too_many_tags(self):
        """POST /api/bookmarks/ with more than 5 tags should return 400."""
        data = {
            "url": "https://example.com",
            "title": "Too Many Tags",
            "tags": ["a", "b", "c", "d", "e", "f"],
        }
        response = self.client.post("/api/bookmarks/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class BookmarkDetailTests(TestCase):
    """Tests for PUT /api/bookmarks/:id/ and DELETE /api/bookmarks/:id/"""

    def setUp(self):
        self.client = APIClient()
        self.bookmark = Bookmark.objects.create(
            url="https://update-me.com",
            title="Update Me",
            description="Will be updated",
            tags=["old"],
        )

    def test_update_bookmark(self):
        """PUT /api/bookmarks/:id/ should update and return 200."""
        updated_data = {
            "url": "https://updated.com",
            "title": "Updated Title",
            "description": "Updated description",
            "tags": ["new"],
        }
        response = self.client.put(
            f"/api/bookmarks/{self.bookmark.id}/", updated_data, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Updated Title")

    def test_update_nonexistent_bookmark(self):
        """PUT /api/bookmarks/9999/ should return 404."""
        updated_data = {
            "url": "https://nope.com",
            "title": "Nope",
        }
        response = self.client.put("/api/bookmarks/9999/", updated_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_bookmark(self):
        """DELETE /api/bookmarks/:id/ should return 204."""
        response = self.client.delete(f"/api/bookmarks/{self.bookmark.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Bookmark.objects.count(), 0)

    def test_delete_nonexistent_bookmark(self):
        """DELETE /api/bookmarks/9999/ should return 404."""
        response = self.client.delete("/api/bookmarks/9999/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
