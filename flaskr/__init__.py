import os
from flask import *
from flask_sqlalchemy import SQLAlchemy
from flaskr.dbconnect import connection
from flask_cors import CORS, cross_origin
import jinja2
import json
import logging
import secrets
import datetime
import stripe


path = os.path.join(os.path.dirname(__file__),'templates')
jinja_env = jinja2.Environment(loader = jinja2.FileSystemLoader(path),autoescape = True)
logging.getLogger('flask_cors').level = logging.DEBUG
session = {}
stripe.api_key = 'sk_test_51HmmCoFxosqMg9CBVWZwyz4gSCFx4PrmftFi4mIR2fFuWCIuLlwlg0RHFiPuHaITE7WsRAbhSc2zNd1PNYlHHoOY00XHcuwbxA'

def create_app(test_config=None):
    #create a configure the app
    app = Flask(__name__, instance_relative_config=True) #creates flask instance
    app.config.from_pyfile('settings.py')

    #make this for all paths
    # cors = CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
    cors = CORS(app)

    db = SQLAlchemy(app, session_options={'autocommit': False})
    if test_config is None:
        #load instance config if it exits- can be used to set real secret key
        app.config.from_pyfile('config.py', silent=True)
    else:
        #load test config if passed
        app.config.from_mapping(test_config)

    #ensure instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @app.route('/signup', methods=['POST', 'OPTIONS'])
    @cross_origin()
    def postTest():
        if request.method == "POST":
            details=request.data
            details=details.decode('utf-8')
            details = json.loads(details)
            name = details['firstName']+ ' ' + details['lastName']
            email = details['email']
            password = details['password']
            security_answer = details['security']
            c, conn = connection(app.config["DB_HOST"],app.config["DB_USERNAME"], app.config["DB_PASSWORD"], app.config["DATABASE_NAME"])
            try:
                c.execute('INSERT INTO user(name, email, password, security_question_answer) VALUES  (%s,%s,%s, %s)', (name, email, password, security_answer))
            except Exception as e:
                c.close()
                return json.dumps({'success':False, 'error':str(e)})
            conn.commit()
            c.close()
            return json.dumps({ 'success': True })
        return json.dumps({'success':False})


    @app.route('/userexists', methods=['POST', 'OPTIONS'])
    @cross_origin()
    def checkuser():
        if request.method == "POST":
            print("POST RECEIVED")
            details=request.data
            print(details)
            details = json.loads(details)
            c, conn = connection(app.config["DB_HOST"],app.config["DB_USERNAME"], app.config["DB_PASSWORD"], app.config["DATABASE_NAME"])
            c.execute('SELECT * FROM user WHERE email = \'{}\''.format(details['email']))
            conn.commit()
            data = c.fetchall()
            c.close()
            print(data)
            if(len(data)!=0):
                response = json.dumps({'exists':True})
            else:
                response = json.dumps({'exists':False})
            return response


    @app.route('/login', methods=['POST', 'OPTIONS'])
    @cross_origin()
    def login():
        if request.method == "POST":
            details = request.data
            details = json.loads(details)
            c, conn = connection(app.config["DB_HOST"],app.config["DB_USERNAME"], app.config["DB_PASSWORD"], app.config["DATABASE_NAME"])
            c.execute('SELECT id, password, major FROM user WHERE email = \'{}\''.format(details["email"]))
            conn.commit()
            data = c.fetchall()
            if(len(data)!=0):
                if(data[0][1]==details["password"]):
                    session_id = secrets.token_hex(16)
                    uid = data[0][0]
                    major = data[0][2]
                    c.close()
                    session[session_id] = {"uid":uid, "email": details["email"], "password":details["password"], "major":major, "login":True}
                    print(session)
                    #if null then need to go to login
                    response = json.dumps({"exists":True, "valid":True, "session_id": session_id})
                else:
                    response = json.dumps({"exists":True, "valid":False})
            else:
                response = json.dumps({"exists": False})
        else:
            response =  json.dumps({"exists":False})   
        return response

    
    @app.route('/addfavorite', methods=['POST','OPTIONS'])
    @cross_origin()
    def addfavorite():
        if request.method == "POST":
            details = request.data
            details = json.loads(details)
            if details['session_id'] in session:
                #print(type(details['user_id']))
                c, conn = connection(app.config["DB_HOST"],app.config["DB_USERNAME"], app.config["DB_PASSWORD"], app.config["DATABASE_NAME"])
                try:
                    c.execute('INSERT INTO in_favorites(user_id, listing_id, price) VALUES  (%s,%s,%s)', (session[details['session_id']]["uid"], details['listing_id'],details['price']))
                except Exception as e:
                    c.close()
                    return json.dumps({'success': False, 'error':str(e)})
                conn.commit()
                c.close()
                return json.dumps({ 'success': True })


    @app.route('/newlisting', methods=['POST','OPTIONS'])
    @cross_origin()
    def newlisting():
        if request.method == "POST":
            details = request.data
            details = json.loads(details)
            print(details)
            if details['session_id'] in session:
                print(details)
                c, conn = connection(app.config["DB_HOST"],app.config["DB_USERNAME"], app.config["DB_PASSWORD"], app.config["DATABASE_NAME"])
                try:
                    c.execute('INSERT INTO listing(seller_id, name, price, description, sold, ship, pick_up, category, weight, zipcode) VALUES  (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)', (session[details['session_id']]["uid"], details['name'],details['price'],details['description'],0,details['ship'],details['pick_up'],details['category'],details['weight'],details['zipcode']))
                    c.execute('SELECT LAST_INSERT_ID()')
                except Exception as e:
                    c.close()
                    return json.dumps({'success': False, 'error':str(e)})
                newid = c.fetchall()
                conn.commit()
                c.close()
                return json.dumps({ 'success': True, 'listing_id': newid[0][0]})


    @app.route('/addreview', methods=['POST'])
    @cross_origin()
    def addreview():
        if request.method == "POST":
            details = request.data
            details = json.loads(details)
            if details['session_id'] in session:
                c, conn = connection(app.config["DB_HOST"],app.config["DB_USERNAME"], app.config["DB_PASSWORD"], app.config["DATABASE_NAME"])
                try:
                    c.execute('INSERT INTO review(buyer_id, seller_id, listing_id, score, comments) VALUES  (%s,%s,%s,%s,%s)', (session[details['session_id']]["uid"], details['seller_id'],details['listing_id'],details['score'], details['comments']))
                except Exception as e:
                    c.close()
                    return json.dumps({'success': False, 'error':str(e)})
                conn.commit()
                c.close()
                return json.dumps({ 'success': True })

    @app.route('/newpurchase', methods=['POST'])
    @cross_origin()
    def newpurchase():
        if request.method == "POST":
            details = request.data
            details = json.loads(details)
            if details['session_id'] in session:
                c, conn = connection(app.config["DB_HOST"],app.config["DB_USERNAME"], app.config["DB_PASSWORD"], app.config["DATABASE_NAME"])
                try:
                    c.execute('INSERT INTO purchase(buyer_id, listing_id, total, date_time, retrieval_method) VALUES  (%s,%s,%s,%s,%s)', (session[details['session_id']]["uid"], details['listing_id'],details['total'],details['date_time'],details['retrieval_method']))
                    #c.execute('SELECT LAST_INSERT_ID()')
                except Exception as e:
                    c.close()
                    return json.dumps({'success': False, 'error':str(e)})
                conn.commit()
                c.close()
                return json.dumps({ 'success': True })
    
    @app.route('/getlistings', methods=['POST', 'OPTIONS'])
    @cross_origin()
    def getlistings():
        if request.method == "POST":
            details = request.data
            details = json.loads(details)
            print(details)
            if details['session_id'] in session:
                numRows = details['rows']
                offset = details['offset']
                c, conn = connection(app.config["DB_HOST"],app.config["DB_USERNAME"], app.config["DB_PASSWORD"], app.config["DATABASE_NAME"])
                try:
                    c.execute('WITH T1 AS (SELECT listing.*, image.image_path FROM listing, image WHERE listing.id = image.listing_id) SELECT T1.*, u.name as seller_name FROM T1  join user u on u.id=T1.seller_id WHERE T1.sold = 0 LIMIT %s OFFSET %s', (numRows, offset))
                except Exception as e:
                    c.close()
                    return json.dumps({'success':False, 'error':str(e)})
                conn.commit()
                desc = c.description
                column_names = [col[0] for col in desc]
                data = [dict(zip(column_names, row)) for row in c.fetchall()]
                c.close()
                print(data)
                return json.dumps({"success":True, "listings": data})
            return json.dumps({"success":False, "error": "Invalid session id"})

    @app.route('/filterbyprice', methods=['POST', 'OPTIONS'])
    @cross_origin()
    def filterbyprice():
        if request.method == "POST":
            details = request.data
            details = json.loads(details)
            if details['session_id'] in session:
                numRows = details['rows']
                offset = details['offset']
                c, conn = connection(app.config["DB_HOST"],app.config["DB_USERNAME"], app.config["DB_PASSWORD"], app.config["DATABASE_NAME"])
                try:
                    c.execute('SELECT l.id,l.seller_id, l.name, l.price,l.description, l.sold,l.ship,l.pick_up,l.category,l.weight,l.zipcode,u.name as seller_name FROM listing l join user u on u.id=l.seller_id WHERE l.sold = 0 ORDER BY price LIMIT %s OFFSET %s', (numRows, offset))
                    # c.execute('SELECT * FROM listing WHERE listing.sold = 0 ORDER BY price LIMIT %s OFFSET %s', (numRows, offset))
                except Exception as e:
                    c.close()
                    return json.dumps({'success':False, 'error':str(e)})
                conn.commit()
                desc = c.description
                column_names = [col[0] for col in desc]
                data = [dict(zip(column_names, row)) for row in c.fetchall()]
                c.close()
                #print(answer)
                return json.dumps({"success":True, "listings": data})
            return json.dumps({"success":False, "error": "Invalid session id"})
            

    @app.route('/getpurchases', methods=['POST', 'OPTIONS'])
    @cross_origin()
    def getpurchases():
        if request.method == "POST":
            details = request.data
            details = json.loads(details)
            if details['session_id'] in session:
                c, conn = connection(app.config["DB_HOST"],app.config["DB_USERNAME"], app.config["DB_PASSWORD"], app.config["DATABASE_NAME"])
                try:
                    c.execute('SELECT p.id, p.buyer_id, l.seller_id, p.listing_id, p.total, p.date_time, p.retrieval_method, l.name, l.description, u.name as seller_name FROM purchase AS p, listing AS l, user AS u WHERE u.id=l.seller_id and l.id = p.listing_id AND p.buyer_id = \'{}\''.format(session[details['session_id']]["uid"]))
                    #print(session[details['session_id']]["uid"][0])
                    #c.execute('SELECT * FROM listing')
                except Exception as e:
                    c.close()
                    return json.dumps({'success': False, 'error':str(e)})
                conn.commit()
                desc = c.description
                column_names = [col[0] for col in desc]
                data = [dict(zip(column_names, row)) for row in c.fetchall()]
                print(data)
                c.close()
                return json.dumps({'success':True, 'purchases': data}, default = myconverter )

    @app.route('/getimages', methods=['POST', 'OPTIONS'])
    @cross_origin()
    def getimages():
        if request.method == "POST":
            details = request.data
            details = json.loads(details)
            if details['session_id'] in session:
                print(details)
                c, conn = connection(app.config["DB_HOST"],app.config["DB_USERNAME"], app.config["DB_PASSWORD"], app.config["DATABASE_NAME"])
                try:
                    c.execute('SELECT image_path FROM image WHERE listing_id = %s', (details['listing_id']))
                except Exception as e:
                    c.close()
                    return json.dumps({'success': False, 'error':str(e)})
                conn.commit()
                desc = c.description
                column_names = [col[0] for col in desc]
                data = [dict(zip(column_names, row)) for row in c.fetchall()]
                c.close()
                return json.dumps({'success':True, 'images': data}, default = myconverter )

    @app.route('/getseller', methods=['POST','OPTIONS'])
    @cross_origin()
    def getseller():
        if request.method == "POST":
            details = request.data
            details = json.loads(details)
            sellerinfo = ""
            listings = ""
            if details['session_id'] in session:
                c, conn = connection(app.config["DB_HOST"],app.config["DB_USERNAME"], app.config["DB_PASSWORD"], app.config["DATABASE_NAME"])
                try:
                    c.execute('SELECT * FROM user, seller WHERE user.id = seller.user_id AND user.id = \'{}\''.format(details['seller_id']))
                    desc = c.description
                    column_names = [col[0] for col in desc]
                    sellerinfo = [dict(zip(column_names, row)) for row in c.fetchall()]
                    c.execute('WITH T1 AS (SELECT listing.*, image.image_path FROM listing, image WHERE listing.id = image.listing_id) SELECT * FROM T1, seller WHERE seller_id=user_id and sold = 0 and seller_id =  \'{}\''.format(details['seller_id']))
                    desc = c.description
                    column_names = [col[0] for col in desc]
                    listings = [dict(zip(column_names, row)) for row in c.fetchall()]
                except Exception as e:
                    c.close()
                    return json.dumps({'success': False, 'error':str(e)})
                conn.commit()
                c.close()
                return json.dumps({"success":True, "seller_info": sellerinfo, "listings": listings})
    
    @app.route('/getfavorites', methods=['POST','OPTIONS'])
    @cross_origin()
    def getfavorites():
        if request.method == "POST":
            details = request.data
            details = json.loads(details)
            if details['session_id'] in session:
                c, conn = connection(app.config["DB_HOST"],app.config["DB_USERNAME"], app.config["DB_PASSWORD"], app.config["DATABASE_NAME"])
                try:
                    c.execute('WITH T1 AS (SELECT listing.*, image.image_path FROM listing, image WHERE listing.id = image.listing_id) SELECT T1.*, u.name as seller_name FROM T1 join user u on u.id=T1.seller_id WHERE T1.sold = 0 and T1.id IN (SELECT listing_id FROM in_favorites WHERE user_id = \'{}\')'.format(session[details['session_id']]["uid"]))
                    # c.execute('SELECT * FROM listing WHERE id IN (SELECT listing_id FROM in_favorites WHERE user_id = \'{}\')'.format(session[details['session_id']]["uid"]))
                except Exception as e:
                    c.close()
                    return json.dumps({'success': False, 'error':str(e)})
            conn.commit()
            desc = c.description
            column_names = [col[0] for col in desc]
            data = [dict(zip(column_names, row)) for row in c.fetchall()]
            c.close()
            return json.dumps({ 'success': True, 'favorites':data})

    

    @app.route('/removefavorites', methods=['POST','OPTIONS'])
    @cross_origin()
    def removefavorites():
        if request.method == "POST":
            details = request.data
            details = json.loads(details)
            if details['session_id'] in session:
                c, conn = connection(app.config["DB_HOST"],app.config["DB_USERNAME"], app.config["DB_PASSWORD"], app.config["DATABASE_NAME"])
                try:
                    c.execute('DELETE FROM in_favorites WHERE user_id = %s AND listing_id = %s', (session[details['session_id']]["uid"], details['listing_id']))
                except Exception as e:
                    c.close()
                    return json.dumps({'success': False, 'error':str(e)})
                data = c.fetchall()
                conn.commit()
                return json.dumps({"success":True, "deleted": True})
    


    @app.route('/logout', methods=['POST', 'OPTIONS'])
    @cross_origin()
    def signout():
        if request.method == "POST":
            details = request.data
            details = json.loads(details)
            if details['session_id'] in session:
                try:
                    session_id = session.pop(details['session_id'])
                    # val = "session id not deleted" if details['session_id'] in session else "session id deleted"
                    print(session_id)
                except Exception as e:
                    return json.dumps({'success': False, 'error':str(e)})
                return json.dumps({'success':True, 'logged_out':True})
        return json.dumps({'success':False})
            


    def myconverter(o):
        if isinstance(o, datetime.datetime):
            return o.__str__()

    @app.route('/addkeywords', methods=['POST'])
    @cross_origin()
    def addkeyword():
        errors = []
        if request.method == "POST":
            details = request.data
            details = json.loads(details)
            c, conn = connection(app.config["DB_HOST"],app.config["DB_USERNAME"], app.config["DB_PASSWORD"], app.config["DATABASE_NAME"])
            keywords = details['keywords']
            for word in keywords:
                try:
                    c.execute('INSERT INTO keyword(listing_id, word) VALUES (%s,%s)', (details['listing_id'], word))
                except Exception as e:
                    errors.append(str(e))
            conn.commit()
            c.close()
            # I did this so that if you send 5 keywords and 3 are already in database the other 2 will still add to database, this might be the wrong way to do this
            if(len(errors)>0):
                return json.dumps({'success':False, 'error':errors})
            return json.dumps({ 'success':True})


    @app.route('/addimage', methods=['POST'])
    @cross_origin()
    def addimage():
        if request.method == "POST":
            details = request.data
            details = json.loads(details)
            if details['session_id'] in session:
                c, conn = connection(app.config["DB_HOST"],app.config["DB_USERNAME"], app.config["DB_PASSWORD"], app.config["DATABASE_NAME"])
                try:
                    c.execute('INSERT INTO image (listing_id, image_path) VALUES (%s,%s)', (details['listing_id'], details['image_path']))
                    c.execute('SELECT * FROM image WHERE listing_id = %s AND image_path = %s',(details['listing_id'], details['image_path']))
                except Exception as e:
                    c.close()
                    return json.dumps({'success':False, 'error':str(e)})
                newimage = c.fetchone()
                conn.commit()
                c.close()
                #print(newimage)
                return json.dumps({ 'success':True, 'listing, path':newimage})

    @app.route('/create-stripe-session', methods=['POST'])
    @cross_origin()
    def create_checkout_session():
        if request.method == "POST":
            details = request.data
            details = json.loads(details)
            delivery = details['ship']
            if delivery == 0:
                price = details['price']
            if delivery != 0:
                weight = details['weight']
                preship_price = details['price']
                price = preship_price + weight*3
            item_name = details['name']
            image_path = details['image_path']
            listing_id = details['listing_id']
            print(price)
            print(item_name)
            try:
                checkout_session = stripe.checkout.Session.create(
                    payment_method_types=['card'],
                    line_items=[
                        {
                            'price_data': {
                                'currency': 'usd',
                                'unit_amount': price*100,
                                'product_data': {
                                    'name': ''+item_name,
                                    'images': [image_path],
                                },
                            },
                            'quantity': 1,
                        },
                    ],
                    mode='payment',
                    success_url='http://152.3.53.136:8080/purchasesuccess',
                    cancel_url='http://152.3.53.136:8080/home?success=false',
                )
                return jsonify({'id': checkout_session.id})
            except Exception as e:
                return jsonify(error=str(e)), 403

    
    @app.route('/getrecommendedbypurchases', methods=['POST', 'OPTIONS'])
    @cross_origin()
    def getrecommendedbypurchases():
        if request.method == "POST":
            details = request.data
            details = json.loads(details)
            if details['session_id'] in session:
                c, conn = connection(app.config["DB_HOST"],app.config["DB_USERNAME"], app.config["DB_PASSWORD"], app.config["DATABASE_NAME"])
                try:
                    sql= 'WITH T1 AS (SELECT temp.*, image_path FROM (SELECT l.id, l.name, l.price, l.sold, l.ship, l.pick_up, l.category, l.weight, l.zipcode, l.seller_id, l.description, u.name as seller_name FROM listing AS l, user AS u WHERE l.seller_id = u.id) AS temp LEFT OUTER JOIN image ON image.listing_id = temp.id) SELECT k.listing_id, T1.seller_id, T1.image_path, T1.name, T1.price, T1.sold, T1.ship, T1.pick_up, T1.category, T1.weight, T1.zipcode, T1.description, T1.seller_name FROM keyword AS k LEFT OUTER JOIN T1 ON T1.id = k.listing_id WHERE T1.sold = 0 AND k.word IN (SELECT word FROM keyword, purchase WHERE keyword.listing_id = purchase.listing_id AND purchase.buyer_id = %s)  LIMIT 5'
                    args = [session[details['session_id']]["uid"]]
                    c.execute(sql, args)
                except Exception as e:
                    c.close()
                    return json.dumps({'success':False, 'error':str(e)})
                conn.commit()
                desc = c.description
                column_names = [col[0] for col in desc]
                data = [dict(zip(column_names, row)) for row in c.fetchall()]
                print(data)
                c.close()
                return json.dumps({"success":True, "recommendations": data})
            return json.dumps({"success":False, "error": "Invalid session id"})

    @app.route('/getrecommendedbymajor', methods=['POST', 'OPTIONS'])
    @cross_origin()
    def getrecommendedbymajor():
        if request.method == "POST":
            details = request.data
            details = json.loads(details)
            if details['session_id'] in session:
                print([session[details['session_id']]["major"]])
                c, conn = connection(app.config["DB_HOST"],app.config["DB_USERNAME"], app.config["DB_PASSWORD"], app.config["DATABASE_NAME"])
                try:
                    sql= 'WITH T1 AS (SELECT listing.*, image.image_path FROM listing, image WHERE listing.id = image.listing_id) SELECT T1.*, u.name as seller_name  FROM T1 LEFT OUTER JOIN user AS u  ON T1.seller_id = u.id  WHERE u.major = %s  LIMIT 5'
                    args = [session[details['session_id']]["major"]]
                    c.execute(sql, args)
                except Exception as e:
                    c.close()
                    return json.dumps({'success':False, 'error':str(e)})
                conn.commit()
                desc = c.description
                column_names = [col[0] for col in desc]
                data = [dict(zip(column_names, row)) for row in c.fetchall()]
                print(data)
                c.close()
                return json.dumps({"success":True, "recommendations": data})
            return json.dumps({"success":False, "error": "Invalid session id"})


    
    
    @app.route('/getprofileinfo', methods=['POST','OPTIONS'])
    @cross_origin()
    def getprofileinfo():
        if request.method == "POST":
            details = request.data
            details = json.loads(details)
            profileinfo = ""
            if details['session_id'] in session:
                c, conn = connection(app.config["DB_HOST"],app.config["DB_USERNAME"], app.config["DB_PASSWORD"], app.config["DATABASE_NAME"])
                try:
                    c.execute('SELECT * FROM user WHERE user.id = \'{}\''.format(session[details['session_id']]["uid"]))
                    desc = c.description
                    column_names = [col[0] for col in desc]
                    profileinfo = [dict(zip(column_names, row)) for row in c.fetchall()]
                except Exception as e:
                    c.close()
                    return json.dumps({'success': False, 'error':str(e)})
                conn.commit()
                return json.dumps({"success":True, "profile info": profileinfo})
    
    @app.route('/searchbystring', methods=['POST','OPTIONS'])
    @cross_origin()
    def searchbystring():
        if request.method == "POST":
            details = request.data
            details = json.loads(details)
            if details['session_id'] in session:
                c, conn = connection(app.config["DB_HOST"],app.config["DB_USERNAME"], app.config["DB_PASSWORD"], app.config["DATABASE_NAME"])
                try:
                    sql = 'WITH T1 AS (SELECT listing.*, image.image_path FROM listing, image WHERE listing.id = image.listing_id) SELECT T1.*, u.name as seller_name FROM T1  join user u on u.id=T1.seller_id WHERE T1.sold = 0  AND (T1.name LIKE %s OR T1.description LIKE %s)'
                    # sql = 'SELECT * FROM listing WHERE sold = 0 AND (name LIKE %s OR description LIKE %s)'
                    args = ['%' + details['term'] + '%','%' + details['term'] + '%']
                    c.execute(sql, args)
                except Exception as e:
                    c.close()
                    return json.dumps({'success': False, 'error':str(e)})
            desc = c.description
            column_names = [col[0] for col in desc]
            data = [dict(zip(column_names, row)) for row in c.fetchall()]
            conn.commit()
            return json.dumps({"success":True, "listings": data})
    
    @app.route('/searchbycategory', methods=['POST','OPTIONS'])
    @cross_origin()
    def searchbycategory():
        if request.method == "POST":
            details = request.data
            details = json.loads(details)
            if details['session_id'] in session:
                c, conn = connection(app.config["DB_HOST"],app.config["DB_USERNAME"], app.config["DB_PASSWORD"], app.config["DATABASE_NAME"])
                try:
                    sql = 'WITH T1 AS (SELECT listing.*, image.image_path FROM listing, image WHERE listing.id = image.listing_id) SELECT T1.*, u.name as seller_name FROM T1  join user u on u.id=T1.seller_id WHERE T1.sold = 0  AND T1.category = %s'
                    # sql = 'SELECT * FROM listing WHERE sold = 0 AND category = %s'
                    args = [details['category']]
                    c.execute(sql, args)
                except Exception as e:
                    c.close()
                    return json.dumps({'success': False, 'error':str(e)})
            desc = c.description
            column_names = [col[0] for col in desc]
            data = [dict(zip(column_names, row)) for row in c.fetchall()]
            conn.commit()
            c.close()
            return json.dumps({"success":True, "listings": data})

    
    @app.route('/editprofile', methods=['PATCH'])
    @cross_origin()
    def editprofile():
        if request.method == "PATCH":
            details = request.data
            details = json.loads(details)
            session_id = details['session_id']
            if session_id in session:
                c, conn = connection(app.config["DB_HOST"],app.config["DB_USERNAME"], app.config["DB_PASSWORD"], app.config["DATABASE_NAME"])
                column_names = []
                for edit in details['updates']:
                    column_names.append(edit['key'].strip("\'"))
                    try:
                        key = edit['key'].strip("\'")
                        sql = 'UPDATE user SET {} = %s WHERE id = %s;'.format(key)
                        args = [edit['value'],session[session_id]["uid"]]
                        print(sql)
                        c.execute(sql, args)
                        if key in session[session_id]:
                            session[session_id][key] = edit['value']
                    except Exception as e:
                        c.close()
                        return json.dumps({'success': False, 'error':str(e)})
                conn.commit()
                c.close()
                return json.dumps({"success":True, "updated": column_names})
    
    @app.route('/confirmSecurity', methods=['POST'])
    @cross_origin()
    def confirmSecurity():
         if request.method == "POST":
            details = request.data
            details = json.loads(details)
            email = details['email']
            security = details['securityAnswer']
            c, conn = connection(app.config["DB_HOST"],app.config["DB_USERNAME"], app.config["DB_PASSWORD"], app.config["DATABASE_NAME"])
            try:
                sql = 'Select security_question_answer from user where email=%s'
                args = [email]
                c.execute(sql,args)
                returned = c.fetchall()
                conn.commit()
                c.close()
                if(security!=returned[0][0]):
                    return json.dumps({"success":True, "match": False})
                return json.dumps({"success":True, "match":True})
            except Exception as e:
                c.close()
                return json.dumps({"success": False, "error": str(e)})


    @app.route('/resetpswd', methods=['PATCH'])
    @cross_origin()
    def resetpswd():
        if request.method == "PATCH":
            details = request.data
            details = json.loads(details)            
            c, conn = connection(app.config["DB_HOST"],app.config["DB_USERNAME"], app.config["DB_PASSWORD"], app.config["DATABASE_NAME"])
            try:
                sql = 'UPDATE user SET password = %s WHERE email = %s;'
                args = [details['password'],details['email']]
                c.execute(sql, args)
            except Exception as e:
                c.close()
                return json.dumps({'success': False, 'error':str(e)})
            conn.commit()
            c.close()
            return json.dumps({"success":True})


    @app.route('/getusername', methods=['POST'])
    @cross_origin()
    def getusername():
        if request.method == "POST":
            details = request.data
            details = json.loads(details)
            if details['session_id'] in session:         
                c, conn = connection(app.config["DB_HOST"],app.config["DB_USERNAME"], app.config["DB_PASSWORD"], app.config["DATABASE_NAME"])
                try:
                    sql = 'SELECT name from user WHERE id = %s;'
                    args = [details['id']]
                    c.execute(sql, args)
                except Exception as e:
                    c.close()
                    return json.dumps({'success': False, 'error':str(e)})
                conn.commit()
                name = c.fetchall()
                print(name)
                c.close()
                return json.dumps({"success":True, "name": name[0][0]})
                
    @app.route('/getreviews', methods=['POST','OPTIONS'])
    @cross_origin()
    def getreviews():
        if request.method == "POST":
            details = request.data
            details = json.loads(details)
            if details['session_id'] in session:
                c, conn = connection(app.config["DB_HOST"],app.config["DB_USERNAME"], app.config["DB_PASSWORD"], app.config["DATABASE_NAME"])
                try:
                    sql = 'SELECT * FROM review WHERE seller_id = %s'
                    args = details['seller_id']
                    c.execute(sql,args)
                except Exception as e:
                    c.close()
                    return json.dumps({'success': False, 'error':str(e)})
            conn.commit()
            desc = c.description
            column_names = [col[0] for col in desc]
            data = [dict(zip(column_names, row)) for row in c.fetchall()]
            c.close()
            return json.dumps({ 'success': True, 'reviews':data})  

    @app.route('/checkvalidreview', methods=['POST','OPTIONS'])
    @cross_origin()
    def checkvalidreview():
        if request.method == "POST":
            details = request.data
            details = json.loads(details)
            print(details)
            if details['session_id'] in session:
                c, conn = connection(app.config["DB_HOST"],app.config["DB_USERNAME"], app.config["DB_PASSWORD"], app.config["DATABASE_NAME"])
                try:
                    sql = 'SELECT * from purchase p join listing l where p.listing_id = l.id and l.seller_id = %s and p.buyer_id = %s and l.id=%s'
                    args = [details['seller_id'], session[details['session_id']]['uid'],details['listing_id']]
                    c.execute(sql,args)
                except Exception as e:
                    c.close()
                    return json.dumps({'success': False, 'error':str(e)})
                conn.commit()
                data = c.fetchall()
                c.close()
                if(len(data)==0):
                    return json.dumps({'success': True, 'valid': False})
                return json.dumps({'success': True, 'valid': True})











    #ORIGINAL TESTING ROUTES
    @app.route('/hello')
    def hello():
        return 'Hello, World!'

    @app.route('/checkdb/', methods=["GET","POST"])
    def connect_db():
        try:
            c, conn = connection(app.config["DB_HOST"],app.config["DB_USERNAME"], app.config["DB_PASSWORD"], app.config["DATABASE_NAME"])
            c.execute("Select VERSION()")
            data = c.fetchone()
            data = "Database version : " + str(data)
            return(data)
        except Exception as e:
            return(str(e))

    return app
   
