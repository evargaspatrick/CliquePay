from django.urls import path
from . import views

urlpatterns = [
    path('', views.api_root, name='api-root'),
    path('signup',views.register_user),
    path('verify',views.verify_signup)
    ]