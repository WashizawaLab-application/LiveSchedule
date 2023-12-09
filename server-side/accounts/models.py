from django.db import models
from datetime import timedelta
from django.utils import timezone
import hashlib
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    user_id = models.CharField(max_length=20, unique=True)
    username = models.CharField(max_length=30, unique=True)
    password = models.CharField(max_length=20)

    def __str__(self):
        return self.user_id


class AccessToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=40)
    access_datetime = models.DateTimeField()

    @staticmethod
    def create(user: User):
        # tokenを所持している場合削除する
        if AccessToken.objects.filter(user=user).exists():
            AccessToken.objects.get(user=user).delete()

        dt = timezone.now()
        text = user.user_id + user.password + dt.strftime('%Y%m%d%H%M%S%f')
        hash_text = hashlib.sha1(text.encode('utf-8')).hexdigest()

        token = AccessToken.objects.create(
            user = user,
            token = hash_text,
            access_datetime = dt
        )

        return token
    
    @staticmethod
    def get(token_text: str):
        # tokenのチェック
        if AccessToken.objects.filter(token=token_text).exists():
            return AccessToken.objects.get(token=token_text)
        else:
            return None
        
    def check_valid_token(self):
        delta = timedelta(minutes=30)
        if (delta < timezone.now() - self.access_datetime):
            return False
        return True
    
    def update_access_datetime(self):
        self.access_datetime = timezone.now()
        self.save()

    def __str__(self):
        dt = timezone.localtime(self.access_datetime).strftime('%Y/%m/%d %H:%M:%s')
        return self.user.user_id + '(' + dt + ') -' + self.token
