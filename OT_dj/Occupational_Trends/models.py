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
        cursor = connection.cursor()
        
        businessNum = []
        
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
