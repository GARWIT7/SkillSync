from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'password',
            'full_name',
            'college',
            'graduation_year',
            'target_role',
        ]

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'full_name',
            'college',
            'graduation_year',
            'target_role',
        ]
        read_only_fields = ['id', 'username']