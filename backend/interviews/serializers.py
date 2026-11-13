from rest_framework import serializers
from .models import Interview


class InterviewSerializer(serializers.ModelSerializer):

    class Meta:
        model = Interview

        fields = [
            'id',
            'application',
            'interview_date',
            'interview_type',
            'notes',
            'created_at',
        ]

        read_only_fields = [
            'id',
            'created_at',
        ]