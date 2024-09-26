import os
import pymysql
import csv
import logging

# log setting
logging.basicConfig(filename='Save_BusinessEstablish.log', level=logging.DEBUG,
                    format='%(asctime)s %(levelname)s %(name)s %(message)s')
logger = logging.getLogger(__name__)

# mysql setting
connect_db = pymysql.connect(host="127.0.0.1",
                             port=3306,
                             user="root",
                             password="",
                             charset="utf8",
                             db="occupational_trends")

# 取得系所檔案
# "C:\Users\james\OneDrive\桌面\ncku\職業趨勢\系所\112_ulistdepartmentlist_discipline.csv"
path = "C:/Users/james/OneDrive/桌面/ncku/職業趨勢/系所/112_ulistdepartmentlist_discipline.csv"

try:
    with connect_db.cursor() as cursor:
        with open(path, newline='', encoding="utf-8") as csvfile:
            spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')

            rows = 0
            insertCount = 0

            for row in list(spamreader)[3:]:

                d_code = row[10]  # 系所代碼
                field = row[5]  # 領域名稱
                discipline = row[7]  # 學門名稱
                category = row[9]  # 學類名稱

                print(d_code, field, discipline, category)

                # 匯入資料
                if insertCount == 0:
                    sql = 'INSERT INTO `department`(`d_code`, `field`, `discipline`, `category`) VALUES\n'
                    isLast = False

                if insertCount < 100:
                    sql += f'("{d_code}", "{field}", "{discipline}", "{category}"),\n'
                    insertCount += 1
                else:
                    sql += f'("{d_code}", "{field}", "{discipline}", "{category}")\n'

                    sql += 'ON DUPLICATE KEY UPDATE \n' \
                           'field = VALUES(field), ' \
                           'discipline = VALUES(discipline), ' \
                           'category = VALUES(category); '

                    # print(sql)
                    cursor.execute(sql)
                    connect_db.commit()  # 提交至SQL
                    insertCount = 0
                    isLast = True

            if not isLast:
                sql += f'("{d_code}", "{field}", "{discipline}", "{category}")\n'

                sql += 'ON DUPLICATE KEY UPDATE \n' \
                       'field = VALUES(field), ' \
                       'discipline = VALUES(discipline), ' \
                       'category = VALUES(category); '

                # print(sql)
                cursor.execute(sql)
                connect_db.commit()  # 提交至SQL
                insertCount = 0
                isLast = True

    connect_db.close()
    print("insert end")

except pymysql.Error as sqlErr:
    logger.error(sqlErr)
    print('sqlErr:', sqlErr)
    print('sql:', sql)
except Exception as e:
    logger.exception(e)
    print('e:', e)

"""
CREATE TABLE `occupational_trends`.`department` (
`d_code` VARCHAR(10) NOT NULL COMMENT '系所代碼' ,
`name` VARCHAR(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '系所名稱' ,
`college` VARCHAR(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '學院名稱' , 
`field` VARCHAR(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '領域' , 
`discipline` VARCHAR(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '學門' , 
`category` VARCHAR(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '學類' )
ENGINE = InnoDB;
"""
