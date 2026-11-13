from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Interview
from .serializers import InterviewSerializer


class InterviewViewSet(viewsets.ModelViewSet):

    serializer_class = InterviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Interview.objects.filter(
            application__user=self.request.user
        ).order_by('interview_date')