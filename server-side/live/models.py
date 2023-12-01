from django.db import models


class Channel(models.Model):
    info_id = models.SmallAutoField(primary_key=True)
    user_id = models.CharField(max_length=20)
    channel_title = models.CharField(max_length=50, blank=True)
    channel_id = models.CharField(max_length=80)
    channel_thumbnail = models.CharField(max_length=120, blank=True)

    def __str__(self) -> str:
        return self.user_id + ' ' + self.channel_title
