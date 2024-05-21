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
            if len(name['detail']) > 0:
                for detail in name['detail']:
                    # 取得該名稱的code
                    sql = f'SELECT id FROM business_category WHERE detail_name="{detail}";'
                    cursor.execute(sql)
                    fetch = cursor.fetchall()
                    if fetch:
                        d_code = fetch[0][0]
                        sql = f"""SELECT COUNT(*)
                            FROM `company_category` AS CC
                            INNER JOIN company AS C
                            ON CC.tax_id = C.tax_id
                            WHERE CC.code = '{d_code}' AND (C.status = '核准登記' OR C.status = '核准設立');
                        """
                        cursor.execute(sql)
                        fetch = cursor.fetchall()
                        num = fetch[0][0]
                        
                        # 將名字和數量加入list
                        businessNum.append({
                            "occupation": detail,
                            "value": num
                        })
                        
            businessNum.sort(key=lambda element: element["value"])                        
            result = {"result": businessNum}  # 直接构建字典
            return result
                        
        except Exception as e:
            print(f'detail_name error:{e}')
                
                   
class Get_OT(models.Model):
    netmanager = NetManager()   
        
