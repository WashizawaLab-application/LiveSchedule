from rest_framework import serializers

from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('user_id', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

        def create(self, validated_data):
            user = User.objects.create_user(**validated_data)
            return user
        

class LoginSerializer(serializers.Serializer):
    user_id = serializers.CharField(max_length=20, write_only=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, data):
        user_id = data.get('user_id')
        password = data.get('password')
        userId = User.objects.get(user_id=user_id)
        rePassword = User.objects.get(password=password)
        if user_id == userId.user_id:
            if password == rePassword.password:
                return data
            else:
                raise serializers.ValidationError('ログイン失敗')
            

class UserUpdateSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=30, allow_blank=True)

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.save()
        return instance