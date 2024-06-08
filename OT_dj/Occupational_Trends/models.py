from django.db import models, connection


# Create your models here.
class Company(models.Model):
    tax_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    head = models.CharField(max_length=100, default=None)
    address = models.CharField(max_length=100)
    PaidIn_capital = models.IntegerField(default=None)
    status = models.CharField(max_length=20)
    date = models.DateTimeField()
    
    class Meta:
        managed = False
        db_table = 'company'
        

class NetManager(models.Manager):
    def get_BusinessNum(self, name):
        # name = {big:[str], mid:[str], small:[str], detail:[str]}
        cursor = connection.cursor()
        
        businessNum = []  # businessNum[{occupation:str, value:int}]
        
        try:
            if len(name['big']) > 0:
                for big in name['big']:
                    # 取的大項底下的所有code
                    sql = f'SELECT id FROM business_category WHERE big_name="{big}";'
                    cursor.execute(sql)
                    rows = cursor.fetchall()
                    b_codes = [r[0] for r in rows]
                    
                    # 將名字和數量加入list
                    businessNum.append({
                        "occupation": big,
                        "value": CountCompany(b_codes)
                    })
        except Exception as e:
            print(f'big_name error:{e}')
        
        try:
            if len(name['mid']) > 0:
                for mid in name['mid']:
                    # 取得中項底下的所有code
                    sql = f'SELECT id FROM business_category WHERE mid_name="{mid}";'
                    cursor.execute(sql)
                    rows = cursor.fetchall()
                    m_codes = [r[0] for r in rows]
                    
                    # 將名字和數量加入list
                    businessNum.append({
                        "occupation": mid,
                        "value": CountCompany(m_codes)
                    })
        except Exception as e:
            print(f'mid_name error:{e}')
        
        try:
            if len(name['small']) > 0:
                for small in name['small']:
                    # 取得小項底下的所有code
                    sql = f'SELECT id FROM business_category WHERE small_name="{small}";'
                    cursor.execute(sql)
                    rows = cursor.fetchall()
                    s_codes = [r[0] for r in rows]
                    
                    # 將名字和數量加入list
                    businessNum.append({
                        "occupation": small,
                        "value": CountCompany(s_codes)
                    })
                    
                    
        except Exception as e:
            print(f'small_name error:{e}')
        
        try:
            if len(name['detail']) > 0:
                for detail in name['detail']:
                    # 取得該名稱的code
                    sql = f'SELECT id FROM business_category WHERE detail_name="{detail}";'
                    cursor.execute(sql)
                    rows = cursor.fetchall()
                    d_codes = [r[0] for r in rows]
                    
                    # 將名字和數量加入list
                    businessNum.append({
                        "occupation": detail,
                        "value": CountCompany(d_codes)
                    })
                    
                    # fetch = cursor.fetchall()
                    # if fetch:
                    #     d_code = fetch[0][0]
                        
                    #     # 用檢視表來查詢較快
                    #     sql = f'SELECT count FROM company_number WHERE code = "{d_code}"'
                    #     cursor.execute(sql)
                    #     fetch = cursor.fetchall()
                    #     num = fetch[0][0]
                        
                    #     # 將名字和數量加入list
                    #     businessNum.append({
                    #         "occupation": detail,
                    #         "value": num
                    #     })
                      
        except Exception as e:
            print(f'detail_name error:{e}')
        
        # 排序後回傳    
        businessNum.sort(key=lambda element: element["value"])                        
        result = {"result": businessNum}  # 直接构建字典
        return result
    
        #檢視表
        """
        CREATE VIEW company_number(code, count) AS
        SELECT CC.code, COUNT(*)
        FROM company_category AS CC, company AS C
        WHERE CC.tax_id = C.tax_id AND (C.status = '核准登記' OR C.status = '核准設立')
        GROUP BY CC.code;
        """
 
    def get_DismissNum(self, name):
        # name = {name:str, category:str}
        cursor = connection.cursor()
        
        dismissNum = []  # dismissNum = [{year:int, month:int(month-1), value:int}]
        
        # 初始化dimissNum
        sql = 'SELECT month FROM `company_dismiss` GROUP BY month ORDER BY month;'
        cursor.execute(sql)
        rows = cursor.fetchall()
        months = [r[0] for r in rows]  # months = [yyyymm]
        for month in months:
            dismissNum.append({
                'year': int(month/100),
                'month': month%100,
                'value': 0
            })
        try:
            # 取得該名字的codes
            sql = f'SELECT id FROM business_category WHERE {name["category"]}_name="{name["name"]}";'
            cursor.execute(sql)
            rows = cursor.fetchall()
            codes = [r[0] for r in rows]
            
            # 取得各code的月解散公司數量
            for code in codes:
                sql = f"""SELECT month, COUNT(month)
                FROM `company_category` AS CC
                INNER JOIN `company_dismiss` AS CD
                ON CC.tax_id = CD.tax_id
                WHERE CC.code = "{code}"
                GROUP BY month
                """
                cursor.execute(sql)
                rows = cursor.fetchall()  # row[0] = yyymm, row[1] = count
                for row in rows:
                    dismissMonth = next((d for d in dismissNum if d["year"] == int(row[0]/100) and d["month"] == row[0]%100), None)
                    
                    if dismissMonth:
                        dismissMonth['value'] += row[1]
                    
                    # for d in dismissNum:
                    #     print(d)
                    #     if int(row[0]/100) == d['year'] and row[0]%100 == d['month']:
                    #         d['value'] += row[1]
                    #         break
                                                
        except Exception as e:
            print(e)
           
        result = {"result": dismissNum}  # 直接构建字典
        return result
    
    def get_EstablishNum(self, name):
        # name = {name:str, category:str}
        cursor = connection.cursor()
        
        establishNum = []  # establishNum = [{year:int, month:int(month-1), value:int}]
        
        # 初始化dimissNum
        sql = 'SELECT month FROM `company_establishment` GROUP BY month ORDER BY month;'
        cursor.execute(sql)
        rows = cursor.fetchall()
        months = [r[0] for r in rows]  # months = [yyyymm]
        for month in months:
            establishNum.append({
                'year': int(month/100),
                'month': month%100,
                'value': 0
            })
        try:
            # 取得該名字的codes
            sql = f'SELECT id FROM business_category WHERE {name["category"]}_name="{name["name"]}";'
            # sql = f'SELECT id FROM business_category WHERE detail_name="廚具、衛浴設備安裝工程業";'
            cursor.execute(sql)
            rows = cursor.fetchall()
            codes = [r[0] for r in rows]
            
            # 取得各code的月解散公司數量
            for code in codes:
                sql = f"""SELECT month, COUNT(month)
                FROM `company_category` AS CC
                INNER JOIN `company_establishment` AS CE
                ON CC.tax_id = CE.tax_id
                WHERE CC.code = "{code}"
                GROUP BY month
                """
                cursor.execute(sql)
                rows = cursor.fetchall()  # row[0] = yyymm, row[1] = count
                for row in rows:
                    establishMonth = next((e for e in establishNum if e["year"] == int(row[0]/100) and e["month"] == row[0]%100), None)
                    
                    if establishMonth:
                        establishMonth['value'] += row[1]
                    
                    # for e in establishNum:
                    #     print(e)
                    #     if int(row[0]/100) == e['year'] and row[0]%100 == e['month']:
                    #         e['value'] += row[1]
                    #         break
                                                
        except Exception as e:
            print(e)
           
        result = {"result": establishNum}  # 直接构建字典
        return result
        
    def getRaceNum(self, name, trend):
        # name = {big:[str], mid:[str], small:[str], detail:[str]}
        cursor = connection.cursor()
        
        startYear = 2013
        endYear = 2024
        
        race_data = []
        
        try:
            for category in name:
                if len(name[category]) > 0:
                    for n in name[category]:
                        sql = f'SELECT id FROM business_category WHERE {category}_name="{n}";'
                        cursor.execute(sql)
                        rows = cursor.fetchall()
                        codes = [r[0] for r in rows]
                        race_data.append(RaceCount(codes, trend, n))
            
            # initial result
            result = {}        
            for y in range(startYear, endYear + 1):
                result[f'"{y}"'] = {}
                        
            for r in race_data:
                for y in range(startYear, endYear + 1):
                    result[f'"{y}"'][f'"{r[y]["name"]}"'] = r[y]["value"]
                    
            # print(result)
            return result
                    
        except Exception as e:
            print('getRaceNum error:', e)
            
    def getGraduateNum(self, type, name):
        cursor = connection.cursor()
        
        try:
            if type == "department":
                d_names = [name]  
            else:
                sql = f'SELECT name FROM department WHERE {type} = "{name}"'
                cursor.execute(sql)
                rows = cursor.fetchall()
                d_names = [r[0] for r in rows]
                
            result = [{"year": str(y), "public": 0, "private": 0} for y in range(101, 112)]
                            
            for d_name in d_names:
                sql = f"""
                    SELECT academic_year, establishment_type, SUM(graduates) FROM `graduate`
                    WHERE department_name = "{d_name}"
                    GROUP BY academic_year, establishment_type;
                    """
                cursor.execute(sql)
                rows = cursor.fetchall()
                
                for row in rows:
                    if row[1] == "公立":
                        # 用相減的來定位對應年分
                        result[int(row[0]) - 101]["public"] += int(row[2])
                    elif row[1] == "私立":
                        # 用相減的來定位對應年分
                        result[int(row[0]) - 101]["private"] += int(row[2])
                        
            return result
            
        except Exception as e:
            print('getGraduateNum error:', e)
                              
                   
class Get_OT(models.Model):
    netmanager = NetManager()   
        

def CountCompany(codes):
    cursor = connection.cursor()
       
    # join較慢
    # sql = f"""SELECT COUNT(*)
    #     FROM `company_category` AS CC
    #     INNER JOIN company AS C
    #     ON CC.tax_id = C.tax_id
    #     WHERE CC.code = '{d_code}' AND (C.status = '核准登記' OR C.status = '核准設立');
    # """
    
    # 用檢視表來查詢較快
    # 取得個別code的數量
    sql = 'SELECT count FROM company_number WHERE '
    first = True
    for code in codes:
        if first:
            sql += f'code = "{code}" '
            first = False
            continue
        
        sql += f'OR code = "{code}" '
    
    cursor.execute(sql)
    rows = cursor.fetchall()
    nums = [r[0] for r in rows]
    return sum(nums)

def RaceCount(codes, trendType, name):
    cursor = connection.cursor()
    
    sql = f'SELECT year, SUM(count) FROM `trend_{trendType}_year` WHERE '
    first = True
    for code in codes:
        if first:
            sql += f'code = "{code}" '
            first = False
            continue
        
        sql += f'OR code = "{code}" '
        
    sql += 'GROUP BY year;'
    cursor.execute(sql)
    rows = cursor.fetchall()
    result = [{"year":r[0], "value":int(r[1])} for r in rows if r[0] >= 2013]
    result_sum = {}
    for y in range(2013, 2025):
        value  = sum(r["value"] for r in result if r["year"] <= y)
        result_sum[y] = {"name": name, "value": value}
    
    return result_sum
