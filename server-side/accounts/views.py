from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated

from .serializers import RegisterSerializer, LoginSerializer, UserUpdateSerializer
from .models import User, AccessToken
from .authentication import Authentication


class RegisterView(APIView):
    permission_classes = (AllowAny,)

    @staticmethod
    def post(request, *args, **kwargs):
        print(request.data)
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            # passwordの一致確認
            if serializer.validated_data['password'] != request.data['password_confirmation']:
                return Response({'error': '確認パスワードが一致していません'}, status=status.HTTP_400_BAD_REQUEST)
            
            # user_idが使用されている
            if User.objects.filter(user_id=serializer.validated_data['user_id']).exists():
                return Response({'error': 'このユーザIDは既に使用されています'}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                serializer.save()
            except:
                return Response({'error': '予期せぬエラーが発生しました'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class LoginView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = User.objects.get(user_id=serializer.validated_data['user_id'])
            user_id = serializer.validated_data['user_id']
            token = AccessToken.create(user=user)
            return Response({'message': '正常にログインできました', 'token': token.token, 'user_id': user_id}, status=status.HTTP_200_OK)
        return Response({'error': 'ユーザIDかパスワードが間違っています'}, status=status.HTTP_400_BAD_REQUEST)
        

class UserDetailView(APIView):
    authentication_classes = (Authentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        user = User.objects.filter(user_id=request.data['user_id']).first()

        if not user:
            return Response({'message': 'ユーザ情報が見つかりません'}, status=status.HTTP_404_NOT_FOUND)
        
        response_data = {
            'message': 'ユーザ情報を取得しました',
            'user': {
                'user_id': user.user_id,
                'username': user.username
            }
        }

        return Response(response_data, status=status.HTTP_200_OK)


class UserUpdateView(APIView):
    authentication_classes = (Authentication,)
    permission_classes = (IsAuthenticated,)

    def patch(self, request):
        user_id = request.data['user_id']
        user = User.objects.filter(user_id=user_id).first()

        if not user:
            return Response({'message': 'ユーザが見つかりません'}, status=status.HTTP_404_NOT_FOUND)
        
        if user_id != user.user_id:
            return Response({'message': 'アクセスが禁止されています'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            response_data = {
                'message': 'ユーザネームが更新されました',
                'user': {
                    'username': user.username,
                }
            }

            return Response(response_data, status=status.HTTP_200_OK)
        else:
            errorMsg = serializer.errors.get('non_field_errors', ['User updation failed'])[0]
            return Response({'message': 'ユーザネームの更新に失敗しました', 'cause': errorMsg}, status=status.HTTP_400_BAD_REQUEST)
        

    def post(self, request):
        return Response({'message': 'POSTメソッドは設定されていません'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


class DeleteAccoutView(APIView):
    authentication_classes = (Authentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        user_id = request.data['user_id']
        try:
            user = User.objects.filter(user_id=user_id).first()
            user.delete()
        except User.DoesNotExist:
            raise Response('ユーザ情報が見つかりません', status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({'message': 'アカウントは正常に削除されました'}, status=status.HTTP_200_OK)