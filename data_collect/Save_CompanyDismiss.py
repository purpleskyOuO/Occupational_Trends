import os
import pymysql
import csv
import logging


# log setting
logging.basicConfig(filename='Save_ComapnyDismiss.log', level=logging.DEBUG,
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
path = "C:/Users/james/OneDrive/桌面/ncku/職業趨勢/公司解散"
allFileList = os.listdir(path)

try:
    with connect_db.cursor() as cursor:
        # 依次開啟每個檔案
        for file in allFileList:
            dismiss_month = file[:-4]  # 解散月份
            print("當前匯入月份:", dismiss_month)

            # 讀取檔案並存入sql資料庫
            with open(os.path.join(path, file), newline='', encoding="utf-8") as csvfile:
                spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')

                firstRow = True
                totalCompany = 0

                # 例外處理
                # firstRow = False

                firstRow = True

                for csv_row in spamreader:
                    if firstRow:
                        firstRow = False
                        continue

                    # date = yyyy:mm:dd
                    date = '"' + str(int(csv_row[-1][1:4]) + 1911) + '-' + csv_row[-1][4:6] + '-' + csv_row[-1][6:]

                    print(csv_row[1][1:-1], csv_row[2], date, dismiss_month)

                    # 匯入資料
                    sql = f"""
                        INSERT INTO company_dismiss
                        VALUES ({csv_row[1][1:-1]}, {csv_row[2]}, {date}, {dismiss_month})
                        ON DUPLICATE KEY UPDATE
                            name = VALUES(name),
                            date = VALUES(date),
                            month = VALUES(month);
                    """

                    # 有人搞特殊
                    # date = '"' + str(int(csv_row[-1][:3]) + 1911) + '-' + csv_row[-1][3:5] + '-' + csv_row[-1][5:] + '"'
                    #
                    # print(csv_row[1], csv_row[2], date, dismiss_month)
                    #
                    # sql = f"""
                    #     INSERT INTO company_dismiss
                    #     VALUES ({csv_row[1]}, "{csv_row[2]}", {date}, {dismiss_month})
                    #     ON DUPLICATE KEY UPDATE
                    #         name = VALUES(name),
                    #         date = VALUES(date),
                    #         month = VALUES(month);
                    # """

                    cursor.execute(sql)
                    connect_db.commit()  # 提交至SQL
                    totalCompany += 1

            # 輸入t or f決定是否繼續
            print("total:", totalCompany)
            keepGo = input(f"{file}已匯入，是否繼續?(t/f)")
            if keepGo == 't':
                f = open('匯入完成月份.txt', 'a', encoding="utf-8")
                f.writelines(file + '\n')
                f.close()
            elif keepGo == 'f':
                break

    connect_db.close()

except pymysql.Error as sqlErr:
    logger.error(sqlErr)
    print(sqlErr)
except Exception as e:
    logger.exception(e)
    print(e)

"""
CREATE TABLE `occupational_trends`.`company_dismiss` (
`tax_id` INT(8) NOT NULL COMMENT '統一編號' ,
`name` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '公司名稱' ,
`date` DATE NOT NULL COMMENT '解散日期' ,
`month` INT(6) NOT NULL COMMENT '解散月份(yyyymm)' ,
PRIMARY KEY (`tax_id`)) ENGINE = InnoDB;
"""