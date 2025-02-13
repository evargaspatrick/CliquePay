from django.urls import path
from . import views

urlpatterns = [
    path('', views.api_root, name='api-root'),
    path('signup/',views.register_user, name='register_user'),
    path('verify/',views.verify_signup, name='verify_signup'),
    path('login/',views.user_login, name='user_login'),
    path('renew/',views.renew_tokens, name='renew_tokens'),
    path('logout/',views.logout_user, name='logout_user'),
    path('reset-password/',views.initiate_reset_password, name='initiate_reset_password'),
    path('confirm-reset-password/',views.confirm_reset_password, name='confirm_reset_password'),

    ]