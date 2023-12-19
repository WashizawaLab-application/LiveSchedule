from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from googleapiclient.discovery import build
from rest_framework.permissions import IsAuthenticated
from dotenv import load_dotenv
import os

from .models import Channel
from .serializers import RegisterSerializer
from accounts.authentication import Authentication


load_dotenv()


class SearchView(APIView):
    authentication_classes = (Authentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        youtube = build('youtube', 'v3', developerKey=os.getenv('DEVELOPER_KEY'))
        q= request.data['q']

        if not q:
            return Response({'error': '検索内容が入力されていません'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            response = youtube.search().list(
                part = 'snippet',
                q = q,
                type = 'channel',
                maxResults = 1,
            ).execute()
            
            data = {
                'title': response['items'][0]['snippet']['title'],
                'id': response['items'][0]['snippet']['channelId'],
                'thumbnail': response['items'][0]['snippet']['thumbnails']['medium']['url'],
                'description': response['items'][0]['snippet']['description'],
            }

        except  :
            return Response({'error': '予期しないエラーが発生しました'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'message': 'チャンネル情報を検索できました', 'data': data}, status=status.HTTP_200_OK)
    

class RegisterView(APIView):
    authentication_classes = (Authentication,)
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def post(request, *args, **kwargs):
        print(request.data)
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            if Channel.objects.filter(user_id=serializer.validated_data['user_id'], channel_id=serializer.validated_data['channel_id']).exists():
                return Response({'error': 'このチャンネルは既に登録されています'}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                serializer.save()
            except:
                return Response({'error': '予期しないエラーが発生しました'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            return Response({'message': '正常に登録できました', 'data': serializer.data}, status=status.HTTP_201_CREATED)
    
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ChannelListView(APIView):
    authentication_classes = (Authentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        user_id = request.data['user_id']
        channels = Channel.objects.filter(user_id=user_id)

        if not channels:
            return Response({'message': 'チャンネル情報が見つかりません'}, status=status.HTTP_200_OK)
        
        items = []
        for channel in channels:
            channel_item = {
                'channel_title': channel.channel_title,
                'channel_id': channel.channel_id,
                'channel_thumbnail': channel.channel_thumbnail,
            }
            items.append(channel_item)

        response_data = {
            'message': 'チャンネル情報を取得しました',
            'items': items,
        }

        return Response(response_data, status=status.HTTP_200_OK)
    

class ChannelDeleteView(APIView):
    authentication_classes = (Authentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        channel = Channel.objects.filter(user_id=request.data['user_id'], channel_id=request.data['channel_id']).first()
        if not channel:
            return Response({'error': 'チャンネル情報が見つかりません'}, status=status.HTTP_404_NOT_FOUND)
        data = {
            'user_id': channel.user_id,
            'channel_id': channel.channel_id,
        }

        channel.delete()
        
        return Response({'message': 'チャンネル情報を削除しました', 'data': data}, status=status.HTTP_200_OK)
    

class GetVideoView(APIView):
    authentication_classes = (Authentication,)
    permission_classes = (IsAuthenticated,)
    
    def post(self, request):
        channels = Channel.objects.filter(user_id=request.data['user_id'])
        if not channels:
            return Response({'error': 1}, status=status.HTTP_404_NOT_FOUND)

        channel_id_list = []
        for channel in channels:
            channel_id = channel.channel_id
            channel_id_list.append(channel_id)
        print(channel_id_list)

        youtube = build('youtube', 'v3', developerKey=os.getenv('DEVELOPER_KEY'))
        items = []
        for channel_id in channel_id_list:
            channel = Channel.objects.filter(channel_id=channel_id).first()
            response = youtube.search().list(
                part='snippet',
                channelId = channel_id,
                type = 'video',
                eventType = 'upcoming',
                maxResults = 5,
                order = 'date',
            ).execute()
            
            video_items = []
            for video in response['items']:
                video_item = {
                    'title': video['snippet']['title'],
                    'video_id': video['id']['videoId'],
                    'thumbnail': video['snippet']['thumbnails']['medium']['url']
                }
                video_items.append(video_item)

                item_data = {
                    'icon_url': channel.channel_thumbnail,
                    'items': video_item,
                }
                items.append(item_data)
        
        return Response({'message': '動画を取得できました', 'items': items}, status=status.HTTP_200_OK)
