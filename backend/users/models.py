from django.db import models

# Create your models here.

from django.contrib.auth.models import AbstractUser


class User(AbstractUser):

    full_name = models.CharField(max_length=150, blank=True)
    college = models.CharField(max_length=150, blank=True)
    graduation_year = models.PositiveIntegerField(null=True, blank=True)
    target_role = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.username