from app import app

app.config['JWT_SECRET_KEY'] = 'y82c5goy42c3ur4fx4ugf84xf84g'
app.config['CORS_HEADERS'] = 'Content-Type'

app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = ''
app.config['MYSQL_DATABASE_DB'] = 'users'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'

app.config['MAIL_SERVER'] = 'smtp.yandex.ru'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = 'saitbiblioteki@yandex.ru'
app.config['MAIL_DEFAULT_SENDER'] = 'saitbiblioteki@yandex.ru'
app.config['MAIL_PASSWORD'] = 'mwnlopuaacsmldtj'
