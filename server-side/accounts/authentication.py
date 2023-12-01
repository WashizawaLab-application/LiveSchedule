from rest_framework import authentication, exceptions

from .models import AccessToken


class Authentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        # headersからtoken取得
        token_text = request.META.get('HTTP_X_AUTH_TOKEN')
        if not token_text:
            raise exceptions.AuthenticationFailed({'message': 'Token injustice.'})
        
        token = AccessToken.get(token_text=token_text)
        if token is None:
            raise exceptions.AuthenticationFailed({'message': 'Token not found.'})
        
        if not token.check_valid_token():
            raise exceptions.AuthenticationFailed({'message': 'Token expired.'})
        
        token.update_access_datetime()

        return (token.user, None)