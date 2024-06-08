from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from rest_framework.decorators import api_view
from django.http import JsonResponse
from Occupational_Trends.models import Get_OT
import json

# global receive data
businessName = {}
trendName = {}
raceName = {}

raceTrend = ""
graduateType = ""
graduateName = ""

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
def getTrendName(request):
    if request.method == 'POST':
        try:
            # 解析收到的 JSON 数据
            data = json.loads(request.body.decode('utf-8'))
            global trendName
            trendName = data
            # print('data:')
            # print(data)
            
            # 返回成功响应
            return JsonResponse({'message': 'Post of trendName created successfully'})
        except Exception as e:
            # 处理错误情况
            return JsonResponse({'error': str(e)}, status=500)
    
    elif request.method == 'GET':
        # print('get')
        result = trendName
        # print(result)
        return render(request, 'trendName.html', {'result': result})
    
@csrf_exempt
# @require_POST
@api_view(['GET', 'POST'])
def getRaceName(request):
    if request.method == 'POST':
        try:
            # 解析收到的 JSON 数据
            data = json.loads(request.body.decode('utf-8'))
            global raceName, raceTrend
            raceName = data['name']
            raceTrend = data['trend']
            # print('data:')
            # print(data)
            
            # 返回成功响应
            return JsonResponse({'message': 'Post of raceName created successfully'})
        except Exception as e:
            # 处理错误情况
            return JsonResponse({'error': str(e)}, status=500)
    
    elif request.method == 'GET':
        # print('get')
        # print(result)
        return render(request, 'raceName.html', {'raceName': raceName, 'raceTrend': raceTrend})
    
@csrf_exempt
# @require_POST
@api_view(['GET', 'POST'])
def getGraduateTypeName(request):
    if request.method == 'POST':
        try:
            # 解析收到的 JSON 数据
            data = json.loads(request.body.decode('utf-8'))
            global graduateType, graduateName
            graduateType = data['type']
            graduateName = data['name']
            # print('data:')
            # print(data)
            
            # 返回成功响应
            return JsonResponse({'message': 'Post of graduateTypeName created successfully'})
        except Exception as e:
            # 处理错误情况
            return JsonResponse({'error': str(e)}, status=500)
    
    elif request.method == 'GET':
        # print('get')
        # print(result)
        return render(request, 'graduateTypeName.html', {'graduateType': graduateType, 'graduateName': graduateName})
    
    
def BusinessNum(request):
    businessNum = Get_OT.netmanager.get_BusinessNum(businessName)
    return render(request, 'businessNum.html', {'businessNum': businessNum})

def EstablishNum(request):
    establishNum = Get_OT.netmanager.get_EstablishNum(trendName)
    return render(request, 'establishNum.html', {'establishNum': establishNum})
    
def DismissNum(request):
    dismissNum = Get_OT.netmanager.get_DismissNum(trendName)
    return render(request, 'dismissNum.html', {'dismissNum': dismissNum})

def RaceNum(request):
    raceNum = Get_OT.netmanager.getRaceNum(raceName, raceTrend)
    return render(request, 'raceNum.html', {'raceNum': raceNum})

def GraduateNum(request):
    graduateNum = Get_OT.netmanager.getGraduateNum(graduateType, graduateName)
    return render(request, 'graduateNum.html', {'graduateNum': graduateNum})
    