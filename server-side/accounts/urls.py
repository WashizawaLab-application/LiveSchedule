from django.urls import path

from .views import RegisterView, LoginView, UserDetailView, UserUpdateView, DeleteAccoutView


urlpatterns = [
    path('signup/', RegisterView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('user-detail/', UserDetailView.as_view(), name='user-detail'),
    path('user-update/', UserUpdateView.as_view(), name='user-update'),
    path('delete/', DeleteAccoutView.as_view(), name='delete'),
]