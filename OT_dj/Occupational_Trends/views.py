from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from rest_framework.decorators import api_view
from django.http import JsonResponse
from Occupational_Trends.models import Get_OT
import json

# global receive data
businessName = {}
dismissName = {}

# Create your views here.
def test_view(request):
    return render(request, 'test.html', {
        'data': "Hello Django ",
    })
    
    
@csrf_exempt
# @require_POST
@api_view(['GET', 'POST'])
def getBusinessName(request):
    if request.method == 'POST':
        try:
            # 解析收到的 JSON 数据
            data = json.loads(request.body.decode('utf-8'))
            global businessName
            businessName = data
            # print('data:')
            # print(data)
            
            # 返回成功响应
            return JsonResponse({'message': 'Post of businessName created successfully'})
        except Exception as e:
            # 处理错误情况
            return JsonResponse({'error': str(e)}, status=500)
    
    elif request.method == 'GET':
        # print('get')
        result = businessName
        # print(result)
        return render(request, 'businessName.html', {'result': result})
    
@csrf_exempt
# @require_POST
@api_view(['GET', 'POST'])
def getDismissName(request):
    if request.method == 'POST':
        try:
            # 解析收到的 JSON 数据
            data = json.loads(request.body.decode('utf-8'))
            global dismissName
            dismissName = data
            # print('data:')
            # print(data)
            
            # 返回成功响应
            return JsonResponse({'message': 'Post of dismissName created successfully'})
        except Exception as e:
            # 处理错误情况
            return JsonResponse({'error': str(e)}, status=500)
    
    elif request.method == 'GET':
        # print('get')
        result = dismissName
        # print(result)
        return render(request, 'dismissName.html', {'result': result})
    
    
def BusinessNum(request):
    businessNum = Get_OT.netmanager.get_BusinessNum(businessName)
    return render(request, 'businessNum.html', {'businessNum': businessNum})
    
def DismissNum(request):
    dismissNum = Get_OT.netmanager.get_DismissNum(dismissName)
    return render(request, 'dismissNum.html', {'dismissNum': dismissNum})
    