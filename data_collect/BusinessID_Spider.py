import time

import pymysql
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By


def get_businessID(url: str, code):
    try:
        
        # 開啟瀏覽器
        driver.get(url)
        
        mid_total = int(driver.find_element(By.CSS_SELECTOR, '[style="font-weight:bold; color:red;"]').text)  # 共有'total'筆資料
        print(f'mid_total:{mid_total}')

        while(True):
            # 找到【小類列表】並點擊
            mids = driver.find_elements(By.LINK_TEXT, '【小類列表】')
            mid_names = driver.find_elements(By.CLASS_NAME, 'td_showg')  # 中類名稱
            print('mids_len:', len(mids))
            

            for i in range(len(mids)):
                mid = mids[i]
                mid_name = mid_names[i].text
                print(f'mid_name:{mid_name}')
                # print(mid.text)
                mid.click()
                time.sleep(1)
                
                # 無資料回到上一頁
                try:
                    if driver.find_element(By.CLASS_NAME, 'message_show').text == '查無符合條件資料！':
                        driver.back()
                        continue
                except:
                    pass
                
                small_total = int(driver.find_element(By.CSS_SELECTOR, '[style="font-weight:bold; color:red;"]').text)  # 共有'total'筆資料
                print(f'small_total{small_total}')
                small_back = int((small_total-1)/10)
                
                while(True):
                    # 找到【細類列表】並點擊
                    smalls = driver.find_elements(By.LINK_TEXT, '【細類列表】')
                    small_names = driver.find_elements(By.CLASS_NAME, 'td_showg')  # 小類名稱
                    
                    for j in range(len(smalls)):
                        small = smalls[j]
                        small_name = small_names[j].text
                        print(f'small_name:{small_name}')
                        # print(small.text)
                        small.click()
                        
                        # 無資料回到上一頁
                        try:
                            if driver.find_element(By.CLASS_NAME, 'message_show').text == '查無符合條件資料！':
                                driver.back()
                                continue
                        except:
                            pass

                        detail_total = int(driver.find_element(By.CSS_SELECTOR, '[style="font-weight:bold; color:red;"]').text)  # 共有'total'筆資料
                        print(f'detail_total:{detail_total}')
                        detail_back = int((detail_total-1)/10)
                        
                        while(True):
                            IDs = driver.find_elements(By.CLASS_NAME, 'td_showsc')  # 項目代碼
                            details = driver.find_elements(By.CLASS_NAME, 'td_showg')  # 細類名稱(包含說明)
                            
                            for ID in IDs:
                                if IDs.index(ID) % 2 == 0:
                                    continue
                                print('id:' + ID.text)
                                detail = details[int(IDs.index(ID)/2)].text.split('\n')  # 將名稱和說明分開
                                detail_name = detail[0]
                                print('detail_name:' + detail_name)
                                description = detail[1]
                                # print('description:' + description)
                                
                                # save in database
                                sql = f'INSERT INTO business_category VALUES("{ID.text}", "{big_names[code]}", "{mid_name}", "{small_name}", "{detail_name}", "{description}");'
                                # print(sql)
                                Save(sql)
                            
                            # 檢查是否有下一頁
                            detail_total -= 10
                            if detail_total > 0:
                                driver.find_element(By.LINK_TEXT, '下一頁').click()
                            else:
                                break;

                        time.sleep(1)
                        for d_back in range(detail_back+1):
                            driver.back()
                        
                        # 重新讀一次以防找不到元素  
                        smalls = driver.find_elements(By.LINK_TEXT, '【細類列表】')
                        small_names = driver.find_elements(By.CLASS_NAME, 'td_showg')  # 小類名稱
                        
                    # 檢查是否有下一頁
                    small_total -= 10
                    if small_total > 0:
                        driver.find_element(By.LINK_TEXT, '下一頁').click()
                    else:
                        break;

                for s_back in range(small_back+1):
                    # print('small_bcak')
                    driver.back()
                                    
                # 重新讀一次以防找不到元素
                mids = driver.find_elements(By.LINK_TEXT, '【小類列表】')
                mid_names = driver.find_elements(By.CLASS_NAME, 'td_showg')  # 中類名稱
            
            # 檢查是否有下一頁
            mid_total -= 10
            if mid_total > 0:
                driver.find_element(By.LINK_TEXT, '下一頁').click()
            else:
                break;
                

    except Exception as e:
        print(e)


def Save(sql):
    # print(sql)
    # mysql setting
    connect_db = pymysql.connect(host="127.0.0.1",
                    port=3306,
                    user="root",
                    password="",
                    charset="utf8",
                    db="occupational_trends")
    
    with connect_db.cursor() as cursor:
        try:        
            # 執行資料庫
            cursor.execute(sql)
            connect_db.commit()  # 提交至SQL
            # print(sql)
            print("succeed")
        
        except pymysql.Error as err:
            print(err)
            # print(sql)
            print("fail")
        
        except Exception as e:
            print(e)
            # print(sql)
            print("fail")
    connect_db.close()


options = Options()
options.add_argument("--disable-notifications")
s = Service(r"./chromedriver.exe")
driver = webdriver.Chrome(service=s, options=options)
driver.implicitly_wait(1)

# 營業項目大類
codes = ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'Z')
big_names = {'A': "農、林、漁、牧業",
             'B': "礦業及土石採取業",
             'C': "製造業",
             'D': "水電燃氣業",
             'E': "營造及工程業",
             'F': "批發、零售及餐飲業",
             'G': "運輸、倉儲及通信業",
             'H': "金融、保險及不動產業",
             'I': "專業、科學及技術服務業",
             'J': "文化、運動、休閒及其他服務業",
             'Z': "其他未分類業"}
"""
for code in codes:
    url = f'https://gcis.nat.gov.tw/cod/browseAction.do?method=browse&layer=1&code={code}'
    get_businessID(url, code)
    time.sleep(1)
    driver.back()
"""

code = 'Z'
url = f'https://gcis.nat.gov.tw/cod/browseAction.do?method=browse&layer=1&code={code}'
get_businessID(url, code)
#time.sleep(1)
#driver.back()

"""
CREATE TABLE `occupational_trends`.`business_category` (
    `id` VARCHAR(9) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
    `big_name` VARCHAR(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
    `mid_name` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
    `small_name` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
    `detail_name` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
    `description` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL 
) ENGINE = InnoDB COMMENT = '營業項目代碼';
"""