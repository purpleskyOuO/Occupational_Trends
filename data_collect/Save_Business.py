import os
import logging
import pymysql
import csv

# log setting
logging.basicConfig(filename='Save_Comapny.log', level=logging.DEBUG,
                    format='%(asctime)s %(levelname)s %(name)s %(message)s')
logger = logging.getLogger(__name__)

# mysql setting
connect_db = pymysql.connect(host="127.0.0.1",
                             port=3306,
                             user="root",
                             password="",
                             charset="utf8",
                             db="occupational_trends")

# 取得公司資料檔案
path = "C:/Users/james/OneDrive/桌面/ncku/職業趨勢/商業登記"
allFileList = os.listdir(path)

try:
    with connect_db.cursor() as cursor:
        # 依次開啟每個檔案
        for file in allFileList:
            # 取得該行業的營業代碼
            detail_name = file[13:-4]
            print(detail_name)
            sql = f"SELECT id FROM `business_category` WHERE detail_name = '{detail_name}'"
            cursor.execute(sql)
            row = cursor.fetchone()

            # 兩種以上混和的另外處理
            if row is None:
                f = open('其他職業(商業).txt', 'a', encoding="utf-8")
                f.write(detail_name + '\n')
                f.close()
                print('另外處理')
                continue

            code = row[0]
            print(code)

            sql_t = f"""
                CREATE TABLE IF NOT EXISTS `company_{code}` (
                  `tax_id` varchar(8) NOT NULL COMMENT '統一編號',
                  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '公司名稱',
                  `capital` int(15) DEFAULT NULL COMMENT '資本總額',
                  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '公司狀態',
                  PRIMARY KEY (`tax_id`)
                ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci COMMENT='{detail_name}';
                """

            cursor.execute(sql_t)
            connect_db.commit()  # 提交至SQL

            # 讀取檔案並存入sql資料庫
            with open(os.path.join(path, file), newline='', encoding="utf-8") as csvfile:
                spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')

                totalCompany = 0
                firstRow = True

                # 例外處理
                # firstRow = False
                # responsibility = True

                insertCount = 0

                for csv_row in spamreader:
                    # print(csv_row[0] == '﻿"統一編號"')
                    # print(csv_row[1] == '"商業名稱"')
                    # print(csv_row[-1] == '"登記狀態"')
                    if firstRow:
                        print(csv_row[0], csv_row[1], csv_row[-1])
                        if csv_row[0] == '﻿"統一編號"' and csv_row[1] == '"商業名稱"' and csv_row[-1] == '"登記狀態"':
                            firstRow = False
                            continue
                        else:
                            f = open('其他職業.txt', 'a', encoding="utf-8")
                            f.write(detail_name + '\n')
                            f.close()
                            print('另外處理')
                            break

                    # data
                    tax_id = csv_row[0]
                    name = csv_row[1]
                    status = csv_row[-1]

                    print(tax_id, name, status)

                    # 存入資料
                    # 匯入資料
                    if insertCount == 0:
                        sql = 'INSERT INTO `company`(`tax_id`, `name`, `status`) VALUES\n'
                        sqlCC = 'INSERT INTO `company_category`(`code`, `tax_id`) VALUES\n'
                        sql_code = f'INSERT INTO `company_{code}`(`tax_id`, `name`, `status`) VALUES\n'

                        isLast = False

                    if insertCount < 150:
                        sql += f'({tax_id}, {name}, {status}),\n'
                        sqlCC += f'("{code}", {tax_id}),\n'
                        sql_code += f'({tax_id}, {name}, {status}),\n'

                        insertCount += 1
                    else:
                        sql += f'({tax_id}, {name}, {status})\n'
                        sqlCC += f'("{code}", {tax_id})\n'
                        sql_code += f'({tax_id}, {name}, {status})\n'

                        sql += 'ON DUPLICATE KEY UPDATE \n' \
                               'name = VALUES(name), ' \
                               'capital = VALUES(capital), ' \
                               'status = VALUES(status); '

                        sqlCC += 'ON DUPLICATE KEY UPDATE \n' \
                                 'code = VALUES(code), ' \
                                 'tax_id = VALUES(tax_id); '

                        sql_code += 'ON DUPLICATE KEY UPDATE \n' \
                                    'name = VALUES(name), ' \
                                    'capital = VALUES(capital), ' \
                                    'status = VALUES(status); '

                        # print(sql)
                        # 公司資料
                        cursor.execute(sql)
                        connect_db.commit()  # 提交至SQL
                        # 公司類別
                        cursor.execute(sqlCC)
                        connect_db.commit()  # 提交至SQL
                        # 公司資料(分table)
                        cursor.execute(sql_code)
                        connect_db.commit()  # 提交至SQL
                        insertCount = 0
                        isLast = True

                    totalCompany += 1

            if not isLast:
                sql += f'({tax_id}, {name}, {status})\n'
                sqlCC += f'("{code}", {tax_id})\n'
                sql_code += f'({tax_id}, {name}, {status})\n'

                sql += 'ON DUPLICATE KEY UPDATE \n' \
                       'name = VALUES(name), ' \
                       'capital = VALUES(capital), ' \
                       'status = VALUES(status); '

                sqlCC += 'ON DUPLICATE KEY UPDATE \n' \
                         'code = VALUES(code), ' \
                         'tax_id = VALUES(tax_id); '

                sql_code += 'ON DUPLICATE KEY UPDATE \n' \
                            'name = VALUES(name), ' \
                            'capital = VALUES(capital), ' \
                            'status = VALUES(status); '

                # print(sql)
                # 公司資料
                cursor.execute(sql)
                connect_db.commit()  # 提交至SQL
                # 公司類別
                cursor.execute(sqlCC)
                connect_db.commit()  # 提交至SQL
                # 公司資料(分table)
                cursor.execute(sql_code)
                connect_db.commit()  # 提交至SQL

            # 輸入t or f決定是否繼續
            print(code)
            print(totalCompany)
            # keepGo = input(f"{file}已匯入，是否繼續?(t/f)")
            keepGo = 't'
            if keepGo == 't':
                f = open('匯入完成職業(商業).txt', 'a', encoding="utf-8")
                f.write(file + '\n')
                f.close()
            elif keepGo == 'f':
                break

    connect_db.close()

except pymysql.Error as sqlErr:
    logger.error(sqlErr)
    print(sql)
    print("sqlErr: ", sqlErr)
except Exception as e:
    logger.exception(e)
    print("Error: ", e)

# create table example

"""
CREATE TABLE `company` (
  `tax_id` varchar(8) NOT NULL COMMENT '統一編號',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '公司名稱',
  `capital` int(15) DEFAULT NULL COMMENT '資本總額',
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '公司狀態',
  PRIMARY KEY (`tax_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci COMMENT='公司基本資料';
"""

"""
CREATE TABLE IF NOT EXISTS `company_{code}` (
  `tax_id` varchar(8) NOT NULL COMMENT '統一編號',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '公司名稱',
  `capital` int(15) DEFAULT NULL COMMENT '資本總額',
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '公司狀態',
  PRIMARY KEY (`tax_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci COMMENT='{detailname}';
"""
