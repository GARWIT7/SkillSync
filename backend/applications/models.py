from django.db import models

# Create your models here.

from django.conf import settings
from django.utils import timezone


class JobApplication(models.Model):

    STATUS_CHOICES = [
        ('APPLIED', 'Applied'),
        ('INTERVIEW', 'Interview'),
        ('SELECTED', 'Selected'),
        ('REJECTED', 'Rejected'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='job_applications'
    )

    company_name = models.CharField(max_length=100)
    job_title = models.CharField(max_length=100)

    job_link = models.URLField(blank=True)
    location = models.CharField(max_length=100, blank=True)

    salary = models.CharField(max_length=50, blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='APPLIED'
    )

    applied_date = models.DateField(default=timezone.localdate)

    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.company_name} - {self.job_title}"