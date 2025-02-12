from django.urls import path
from . import views

urlpatterns = [
    path('', views.api_root, name='api-root'),
    path('signup/',views.register_user, name='register_user'),
    path('verify/',views.verify_signup, name='verify_signup')
    ]