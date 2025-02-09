from rest_framework.reverse import reverse
from rest_framework.decorators import api_view
from rest_framework import status
from django.http import JsonResponse
from watchtower.aws_cognito import CognitoService
from .serializers import *

'''
EXAMPLES FOR GET AND POST
@api_view(['GET'])
def getData(request):
    #EXAMPLE
    items = Item.objects.all()
    serializer = ItemSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def addItem(request):
    #EXAMPLE
    serializer = ItemSerializer(data = request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)
'''


@api_view(['POST'])
def register_user(request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            cognito = CognitoService()
            result = cognito.register_user(**serializer.validated_data)
            return JsonResponse(result, status=status.HTTP_201_CREATED if result['status'] == 'SUCCESS' else status.HTTP_400_BAD_REQUEST)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def verify_signup(request):
    serializer = VerifySignupSerializer(data=request.data)
    if serializer.is_valid():
        cognito = CognitoService()
        result = cognito.confirm_sign_up(**serializer.validated_data)
        return JsonResponse(result, status=status.HTTP_200_OK if result['status'] == 'SUCCESS' else status.HTTP_400_BAD_REQUEST)
    return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)