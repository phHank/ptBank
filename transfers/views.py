from django.shortcuts import render
from django.http import JsonResponse

from .models import Transfer

def index(request):
    transfers = Transfer.objects.values()
    data = {
        "transfers": [transfer for transfer in transfers]
    }
    return JsonResponse(data)