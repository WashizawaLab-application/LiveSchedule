from django.urls import path

from .views import SearchView, RegisterView, ChannelListView, ChannelDeleteView, GetVideoView


urlpatterns = [
    path('search/', SearchView.as_view(), name='search'),
    path('register/', RegisterView.as_view(), name='register'),
    path('list/', ChannelListView.as_view(), name='list'),
    path('delete/', ChannelDeleteView.as_view(), name='delete'),
    path('show/', GetVideoView.as_view(), name='get-video'),
]