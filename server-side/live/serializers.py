from rest_framework import serializers
from rest_framework.authtoken.models import Token

from .models import Channel


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = ('user_id', 'channel_title', 'channel_id', 'channel_thumbnail')

        def create(self, validated_data):
            channel = Channel.objects.create_channel(**validated_data)
            Token.objects.create(channel=channel)
            return channel