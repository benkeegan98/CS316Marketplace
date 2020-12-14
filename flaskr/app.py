from flask import *
import MySQLdb

app = Flask(__name__)

app.config.from_pyfile('settings.py')

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method=="POST":
        details=request.form
        name = details['name']
        email = details['email']
        password = details['pswd']
        con = mysql.connect()
        cur = con.cursor()
        cur.execute("INSERT INTO user(name, email, password) VALUES  (%s,%s,%s)", (name, email, password))
        con.commit()
        cur.close()
        return 'success'
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)