from django.contrib import admin

from .models import User, AccessToken


class AccessTokenAdmin(admin.ModelAdmin):
    fields = ['user', 'token', 'access_datetime']

admin.site.register(User)
admin.site.register(AccessToken, AccessTokenAdmin)
