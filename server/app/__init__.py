from flask import Flask
from instances import mysql, host_mail
from .autho.autho import autho_bp
from .reg.reg import reg_bp
from .books.books import books_bp
from flask_jwt_extended import JWTManager
from flask_cors import CORS

app = Flask(__name__, static_folder='../build', static_url_path='/')
CORS(app)
app.register_blueprint(autho_bp, url_prefix='/api/autho')
app.register_blueprint(reg_bp, url_prefix='/api/reg')
app.register_blueprint(books_bp, url_prefix='/api/books')
app.config.from_object('config')
jwt = JWTManager(app)
mysql.init_app(app)
host_mail.init_app(app)

