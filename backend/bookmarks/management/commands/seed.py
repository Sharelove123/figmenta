from django.core.management.base import BaseCommand
from bookmarks.models import Bookmark


class Command(BaseCommand):
    help = "Seed the database with 5 sample bookmarks"

    def handle(self, *args, **options):
        if Bookmark.objects.exists():
            self.stdout.write(self.style.WARNING("Bookmarks already exist. Skipping seed."))
            return

        bookmarks = [
            {
                "url": "https://docs.djangoproject.com/",
                "title": "Django Documentation",
                "description": "Official documentation for the Django web framework.",
                "tags": ["python", "django", "docs"],
            },
            {
                "url": "https://nextjs.org/docs",
                "title": "Next.js Documentation",
                "description": "Learn about Next.js features and API reference.",
                "tags": ["javascript", "react", "nextjs"],
            },
            {
                "url": "https://github.com",
                "title": "GitHub",
                "description": "Where the world builds software. Millions of developers collaborate here.",
                "tags": ["git", "development", "tools"],
            },
            {
                "url": "https://tailwindcss.com/docs",
                "title": "Tailwind CSS Documentation",
                "description": "A utility-first CSS framework for rapid UI development.",
                "tags": ["css", "tailwind", "frontend"],
            },
            {
                "url": "https://www.django-rest-framework.org/",
                "title": "Django REST Framework",
                "description": "A powerful and flexible toolkit for building Web APIs in Django.",
                "tags": ["python", "django", "api"],
            },
        ]

        for bm in bookmarks:
            Bookmark.objects.create(**bm)

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {len(bookmarks)} bookmarks."))
