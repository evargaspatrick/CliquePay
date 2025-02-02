from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import ItemSerializer
from watchtower.models import Item

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