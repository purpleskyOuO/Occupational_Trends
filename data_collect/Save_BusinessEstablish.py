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


# 取得公司資料檔案
path = "C:/Users/james/OneDrive/桌面/ncku/職業趨勢/商業設立"
allFileList = os.listdir(path)

try:
    with connect_db.cursor() as cursor:
        # 依次開啟每個檔案
        for file in allFileList:
            establish_month = file[7:-4]  # 解散月份
            print("當前匯入月份:", establish_month)

            # 讀取檔案並存入sql資料庫
            with open(os.path.join(path, file), newline='', encoding="utf-8") as csvfile:
                spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')

                firstRow = True
                totalBusiness = 0

                # 例外處理
                # firstRow = False

                firstRow = True
                insertCount = 0

                for csv_row in spamreader:
                    if firstRow:
                        firstRow = False
                        continue

                    if csv_row[-2][:3] and csv_row[-2][:3].isdigit():
                        # date = yyyy:mm:dd
                        date = '"' + str(int(csv_row[-2][:3]) + 1911) + '-' + csv_row[-2][3:5] + '-' + csv_row[-2][5:] + '"'
                    elif csv_row[-2][1:4] and csv_row[-2][1:4].isdigit():
                        date = '"' + str(int(csv_row[-2][1:4]) + 1911) + '-' + csv_row[-2][4:6] + '-' + csv_row[-2][6:]
                    else:
                        date = '""'

                    tax_id = csv_row[2]
                    name = csv_row[3]

                    print(tax_id, name, date, establish_month)

                    # 無tax_id未來處理
                    """
                    try:
                        if csv_row[-1].isdigit():
                            int(tax_id)
                        else:
                            int(tax_id[1:-1])
                    except Exception as e_no_tax_id:
                        if csv_row[-1].isdigit():
                            sql_no_tax_id = f'INSERT INTO `bus_no_tax_id`(' \
                                            f'`city_county`, `tax_id`, `bus_name`, `address`, `capital_amount`, `type`, ' \
                                            f'`head`, `change_date`, `approval_number`) VALUES (' \
                                            f'"{csv_row[1]}", "{tax_id}", "{name}", "{csv_row[4]}", {csv_row[5]}, ' \
                                            f'"{csv_row[6]}", "{csv_row[7]}", {csv_row[8]}, "{csv_row[9]}");'
                        else:
                            sql_no_tax_id = f'INSERT INTO `bus_no_tax_id`(' \
                                            f'`city_county`, `tax_id`, `bus_name`, `address`, `capital_amount`, `type`, ' \
                                            f'`head`, `change_date`, `approval_number`) VALUES (' \
                                            f'{csv_row[1]}, {tax_id}, {name}, {csv_row[4]}, {csv_row[5]}, ' \
                                            f'{csv_row[6]}, {csv_row[7]}, {csv_row[8]}, {csv_row[9]});'

                        cursor.execute(sql_no_tax_id)

                        print('e_no_tax_id', e_no_tax_id)
                        continue
                    """

                    # 匯入資料
                    if insertCount == 0:
                        sql = 'INSERT INTO `company_establishment`(`tax_id`, `name`, `date`, `month`) VALUES\n'
                        isLast = False

                    if insertCount < 100:
                        if tax_id.isdigit():
                            sql += f'("{tax_id}", "{name}", {date}, {establish_month}),\n'
                        else:
                            sql += f'({tax_id}, {name}, {date}, {establish_month}),\n'
                        insertCount += 1
                    else:
                        if tax_id.isdigit():
                            sql += f'("{tax_id}", "{name}", {date}, {establish_month})\n'
                        else:
                            sql += f'({tax_id}, {name}, {date}, {establish_month})\n'

                        sql += 'ON DUPLICATE KEY UPDATE \n' \
                               'name = VALUES(name), ' \
                               'date = VALUES(date), ' \
                               'month = VALUES(month);'

                        # print(sql)
                        cursor.execute(sql)
                        connect_db.commit()  # 提交至SQL
                        insertCount = 0
                        isLast = True

                    totalBusiness += 1

            if not isLast:
                # if tax_id.isdigit():
                #     sql += f'("{tax_id}", "{name}", {date}, {establish_month})\n'
                # else:
                #     sql += f'({tax_id}, {name}, {date}, {establish_month})\n'

                sql += 'ON DUPLICATE KEY UPDATE \n' \
                       'name = VALUES(name), ' \
                       'date = VALUES(date), ' \
                       'month = VALUES(month);'

                cursor.execute(sql)
                connect_db.commit()  # 提交至SQL

            # 輸入t or f決定是否繼續
            print("total:", totalBusiness)
            # keepGo = input(f"{file}已匯入，是否繼續?(t/f)")
            keepGo = 't'
            if keepGo == 't':
                f = open('匯入完成月份(商業設立).txt', 'a', encoding="utf-8")
                f.writelines(file + '\n')
                f.close()
            elif keepGo == 'f':
                break

    connect_db.close()

except pymysql.Error as sqlErr:
    logger.error(sqlErr)
    print('sqlErr:', sqlErr)
    print('sql:', sql)
except Exception as e:
    logger.exception(e)
    print('e:', e)

"""
CREATE TABLE `occupational_trends`.`company_dismiss` (
`tax_id` INT(8) NOT NULL COMMENT '統一編號' ,
`name` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '公司名稱' ,
`date` DATE NOT NULL COMMENT '解散日期' ,
`month` INT(6) NOT NULL COMMENT '解散月份(yyyymm)' ,
PRIMARY KEY (`tax_id`)) ENGINE = InnoDB;
"""