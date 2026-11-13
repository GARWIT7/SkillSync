from django.db import models

# Create your models here.

from django.conf import settings


class Skill(models.Model):

    PROFICIENCY_CHOICES = [
        ('BEGINNER', 'Beginner'),
        ('INTERMEDIATE', 'Intermediate'),
        ('ADVANCED', 'Advanced'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='skills'
    )

    skill_name = models.CharField(max_length=100)

    proficiency = models.CharField(
        max_length=20,
        choices=PROFICIENCY_CHOICES,
        default='BEGINNER'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'skill_name'],
                name='unique_skill_per_user'
            )
        ]

    def __str__(self):
        return f"{self.skill_name} - {self.proficiency}"