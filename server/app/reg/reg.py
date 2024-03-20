from flask import request, Blueprint
from instances import mysql, host_mail
from flask_mail import Message
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash
import random
import re

reg_bp = Blueprint('reg_bp', __name__, template_folder='templates', static_folder='static')


@reg_bp.route('/', methods=['GET', 'POST'])
def reg():
    conn = mysql.connect()
    cursor = conn.cursor()
    user = request.json['data']
    query1 = 'SELECT * FROM users WHERE login=%s'
    cursor.execute(query1, ({user["login"]}))
    data = cursor.fetchall()
    if len(data) == 1:
        return '0'
    else:
        access_token = create_access_token(identity=user["login"])
        query2 = 'INSERT INTO users SET login=%s, password=%s, email=%s'
        cursor.execute(query2, ({user["login"]}, {generate_password_hash(user["password"])}, {user["email"]}))
    conn.commit()
    conn.close()
    return access_token


@reg_bp.route('/mail', methods=['GET', 'POST'])
def mail():
    email = request.json["data"]
    if not re.match(r"^\S+@\S+\.\S+$", email):
        return '0'
    msg = Message("Подтверждение электронной почты", sender="saitbiblioteki@yandex.ru", recipients=[email])
    code = random.randint(1000, 9999)
    msg.body = f"Введите этот код в соответствующее поле в форме регистрации:\n  {code}"
    host_mail.send(msg)
    return {"code": code}
