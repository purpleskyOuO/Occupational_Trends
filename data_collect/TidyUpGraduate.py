import csv
import pymysql

connect_db = pymysql.connect(host="127.0.0.1",
                             port=3306,
                             user="root",
                             password="",
                             charset="utf8",
                             db="occupational_trends")
"""
try:
    # 將資料存入articles
    with connect_db.cursor() as cursor:

        with open('Student_RPT_02.csv', newline='', encoding="utf-8") as csvfile:
            spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')

            firstRow = 0
            for row in spamreader:
                if firstRow < 1:
                    firstRow += 1
                    continue

                sql = """"""
                    INSERT INTO graduate
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """"""

                # 執行資料庫
                cursor.execute(sql, (row[1], row[2], row[3], row[4], row[5], row[6],
                               row[7], row[8], row[9], row[10], row[11]))
                connect_db.commit()  # 提交至SQL
    connect_db.close()
except Exception as ex:
    print(ex)
"""

try:
    # 將資料存入articles
    with connect_db.cursor() as cursor:

        with open('學2-1.畢業生數及其取得輔系、雙主修資格人數-以「系(所)」統計.csv',
                  newline='', encoding="utf-8") as csvfile:
            spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')

            Rows = 0
            for row in spamreader:
                if Rows < 1:
                    print(row)
                    Rows += 1
                    continue

                sql = """
                    INSERT INTO graduate
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """

                # 執行資料庫
                cursor.execute(sql, (row[0], row[1], row[2], row[3], row[4], row[5],
                               row[6], row[7], row[8], row[9], row[10]))
                connect_db.commit()  # 提交至SQL

                print(f"第{Rows}資料插入成功")
                Rows += 1

    connect_db.close()
except Exception as ex:
    print(ex)


with open('Student_RPT_02.csv', newline='', encoding="utf-8") as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
    a = 0
    maxlen = [0] * 8
    for row in spamreader:
        if a < 2:
            print(row)
            a += 1

        for i in range(len(maxlen)):
            maxlen[i] = max(maxlen[i], len(row[i + 2]))

    print(maxlen)

# create sql table
"""
CREATE TABLE `occupational_trends`.`graduate` (
        `academic_year` INT(4) NOT NULL ,
        `establishment_type` VARCHAR(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_nopad_ci NOT NULL ,
        `school_type` VARCHAR(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
        `school_code` VARCHAR(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
        `school_name` VARCHAR(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
        `department_code` VARCHAR(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
        `department_name` VARCHAR(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
        `educational_system` VARCHAR(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
        `graduates` INT(8) NULL , `graduates_male` INT(8) NULL , `graduates_female` INT(8) NULL 
       ) ENGINE = InnoDB;
"""
