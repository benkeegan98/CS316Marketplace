import pymysql
pymysql.install_as_MySQLdb()
import MySQLdb

def connection(host, user, passwd, db):
    conn = MySQLdb.connect(host=host,
                           user = user,
                           passwd = passwd,
                           db = db)
    c = conn.cursor()
    return c, conn