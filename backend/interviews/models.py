from django.db import models

# Create your models here.
    


class Interview(models.Model):

    INTERVIEW_TYPES = [
        ('ONLINE', 'Online'),
        ('OFFLINE', 'Offline'),
        ('PHONE', 'Phone'),
    ]

    application = models.ForeignKey(
        'applications.JobApplication',
        on_delete=models.CASCADE,
        related_name='interviews'
    )

    interview_date = models.DateTimeField()

    interview_type = models.CharField(
        max_length=20,
        choices=INTERVIEW_TYPES,
        default='ONLINE'
    )

    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.application.company_name} - Interview"