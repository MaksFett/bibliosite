from flask import request, Blueprint
from instances import mysql
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash

autho_bp = Blueprint('autho_bp', __name__, template_folder='templates', static_folder='static')


@autho_bp.route('/', methods=['GET', 'POST'])
def autho():
    conn = mysql.connect()
    cursor = conn.cursor()
    user = request.json['data']
    query = 'SELECT * FROM users WHERE login=%s'
    cursor.execute(query, ({user["login"]}))
    data = cursor.fetchall()
    if len(data) == 0:
        return '0'
    elif check_password_hash(data[0][1], user['password']):
        access_token = create_access_token(identity=user["login"])
    else:
        return '0'
    conn.commit()
    conn.close()
    return access_token


@autho_bp.route('/readuser', methods=['GET', 'POST'])
@jwt_required()
def readuser():
    login = get_jwt_identity()
    conn = mysql.connect()
    cursor = conn.cursor()
    query = 'SELECT * FROM users WHERE login=%s'
    cursor.execute(query, ({login}))
    data = cursor.fetchall()
    user = {'login': data[0][0],
            'email': data[0][2]}
    return user


@autho_bp.route('/readbooks', methods=['GET', 'POST'])
@jwt_required()
def readbooks():
    login = get_jwt_identity()
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM books_users WHERE user=%s', ({login}))
    data = cursor.fetchall()
    response = []
    for a in data:
        cursor.execute('SELECT * FROM books WHERE name=%s', ({a[1]}))
        book = cursor.fetchall()[0]
        response.append({'name': book[0], 'page': book[1], 'year': book[2], 'author': book[3], 'about': book[4],
                         'pdf': book[5], 'image': book[6]})
    return response
