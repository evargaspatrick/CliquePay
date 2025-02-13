from rest_framework.reverse import reverse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.http import JsonResponse
from watchtower.aws_cognito import CognitoService
from .serializers import *

@api_view(['GET'])
def api_root(request, format=None):
    """
    API root endpoint that provides links to all available endpoints
    """
    return Response({
        'endpoints': {
            'signup': {
                'url': reverse('register_user', request=request, format=format),
                'method': 'POST',
                'description': 'Register new user'
            },
            'verify': {
                'url': reverse('verify_signup', request=request, format=format),
                'method': 'POST',
                'description': 'Verify user email'
            },
            'login': {
                'url': reverse('user_login', request=request, format=format),
                'method': 'POST',
                'description': 'Log in user and get tokens',
                'tokens_provided': 'Refresh, Id, Access Tokens'
            },
            'refresh': {
                'url': reverse('renew_tokens', request=request, format=format),
                'method': 'POST',
                'description': 'Renew access and ID tokens using refresh token'
            },
            'logout': {
                'url': reverse('logout_user', request=request, format=format),
                'method': 'POST',
                'description': 'Logout the user by rendering the access and refresh tokens invalid'
            },
            'initiate-reset-password': {
                'url': reverse('initiate_reset_password', request=request, format=format),
                'method': 'POST',
                'description': 'Initiate password reset process'
            },
            'confirm-reset-password': {
                'url': reverse('confirm_reset_password', request=request, format=format),
                'method': 'POST',
                'description': 'Confirm password reset with verification code'
            }
        },
        'version': 'development',
        'status': 'online',
        'documentation': 'API documentation will be available soon ~yp'
    })

@api_view(['POST'])
def register_user(request):
    """
    Register a new user with AWS Cognito
    
    Request body:
    {
        "username": "example_user",
        "password": "Example123!",
        "email": "user@example.com",
        "phone_number": "+1234567890" (optional)
    }
    """
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        cognito = CognitoService()
        result = cognito.register_user(**serializer.validated_data)
        
        if result['status'] == 'SUCCESS':
            return Response({
                'status': 'success',
                'message': result['message'],
                'user_sub': result.get('user_sub'),
                'next_step': 'Check your email for verification code'
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'status': 'error',
            'message': result['message'],
            'error_code': result.get('error_code'),
            'details': 'Registration failed'
        }, status=status.HTTP_400_BAD_REQUEST)
        
    return Response({
        'status': 'error',
        'message': 'Invalid input',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def verify_signup(request):
    """
    Verify user email with confirmation code
    
    Request body:
    {
        "username": "example_user",
        "confirmation_code": "123456"
    }
    """
    serializer = VerifySignupSerializer(data=request.data)
    if serializer.is_valid():
        cognito = CognitoService()
        result = cognito.confirm_sign_up(**serializer.validated_data)
        
        if result['status'] == 'SUCCESS':
            return Response({
                'status': 'success',
                'message': result['message'],
                'next_step': 'You can now login with your credentials'
            }, status=status.HTTP_200_OK)
        
        return Response({
            'status': 'error',
            'message': result['message'],
            'error_code': result.get('error_code'),
            'details': 'Verification failed'
        }, status=status.HTTP_400_BAD_REQUEST)
        
    return Response({
        'status': 'error',
        'message': 'Invalid input',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def user_login(request):
    """
    Login user with username and password
    
    Request body:
    {
        "username": "example_user",
        "password": "Example123!"
    }
    """
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        cognito = CognitoService()
        result = cognito.login_user(**serializer.validated_data)
        
        if result['status'] == 'SUCCESS':
            return Response({
                'status': 'success',
                'message': result['message'],
                'access_token': result['access_token'],
                'refresh_token': result['refresh_token'],
                'id_token': result['id_token']
            }, status=status.HTTP_200_OK)
        
        return Response({
            'status': 'error',
            'message': result['message'],
            'error_code': result.get('error_code'),
            'details': 'Verification failed'
        }, status=status.HTTP_400_BAD_REQUEST)
        
    return Response({
        'status': 'error',
        'message': 'Invalid input',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def renew_tokens(request):
    """
    Renew access and ID tokens using refresh token
    
    Request body:
    {
        "refresh_token": "your-refresh-token"
    }
    """
    serializer = TokenRenewSerializer(data=request.data)
    if serializer.is_valid():
        cognito = CognitoService()
        result = cognito.renew_tokens(serializer.validated_data['refresh_token'])
        
        if result['status'] == 'SUCCESS':
            return Response(result, status=status.HTTP_200_OK)
        
        return Response(result, status=status.HTTP_401_UNAUTHORIZED)
        
    return Response({
        'status': 'error',
        'message': 'Invalid input',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout_user(request):
    """
    Pass the access token and make all the session tokens 
    including refresh token invalid, hence 'Logging Out' the user.
    
    Request body:
    {
        "access_token": "QwErTYuioP"
    }
    """
    serializer = LogoutUserSerializer(data=request.data)
    if serializer.is_valid():
        cognito = CognitoService()
        result = cognito.logout_user(serializer.validated_data['access_token'])
        
        if result['status'] == 'SUCCESS':
            return Response(result, status=status.HTTP_200_OK)
        
        return Response(result, status=status.HTTP_401_UNAUTHORIZED)
        
    return Response({
        'status': 'error',
        'message': 'Invalid input',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def initiate_reset_password(request):
    """
    Initiate password reset process
    
    Request body:
    {
        "id_token": "QwErTYuioP"
    }
    """
    serializer = InitiateResetPasswordSerializer(data=request.data)
    if serializer.is_valid():
        cognito = CognitoService()
        result = cognito.initiate_password_reset(serializer.validated_data['id_token'])
        
        if result['status'] == 'SUCCESS':
            return Response(result, status=status.HTTP_200_OK)
        
        return Response(result, status=status.HTTP_400_BAD_REQUEST)
        
    return Response({
        'status': 'error',
        'message': 'Invalid input',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def confirm_reset_password(request):
    """
    Confirm password reset with code
    
    Request body:
    {
        "id_token": "QwErTYuioP",
        "confirmation_code": "123456",
        "new_password": "NewPassword123!"
    }
    """
    serializer = ConfirmResetPasswordSerializer(data=request.data)
    if serializer.is_valid():
        cognito = CognitoService()
        result = cognito.confirm_password_reset(
            id_token=serializer.validated_data['id_token'],
            confirmation_code=serializer.validated_data['confirmation_code'],
            new_password=serializer.validated_data['new_password']
        )
        
        if result['status'] == 'SUCCESS':
            return Response(result, status=status.HTTP_200_OK)
        
        return Response(result, status=status.HTTP_400_BAD_REQUEST)
        
    return Response({
        'status': 'error',
        'message': 'Invalid input',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)