from django.db import models

class User(models.Model):
    id = models.CharField(max_length=128, primary_key=True, unique=True)
    cognito_id = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    avatar_url = models.URLField(null=True, blank=True)
    currency = models.CharField(max_length=10, default='USD')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return f"{self.name} ({self.email})"