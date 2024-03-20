from instances import mysql
from flask import request, Blueprint, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
import os

books_bp = Blueprint('books_bp', __name__, template_folder='templates', static_folder='static')


@books_bp.route('/matchbooks', methods=['GET', 'POST'])
def matchbooks():
    conn = mysql.connect()
    cursor = conn.cursor()
    data = request.json['data']
    item = data['searchItem']
    if item == '':
        return []
    item_ex = '%' + item + '%'
    if data['findby'] == 'name':
        query = 'SELECT * FROM books AS b WHERE b.name LIKE %s'
    else:
        query = 'SELECT * FROM books AS b WHERE b.author LIKE %s'
    match data['sortby']:
        case 'name':
            query = query + ' ORDER BY b.name'
        case 'year':
            query = query + ' ORDER BY b.year'
        case 'page':
            query = query + ' ORDER BY b.page'
    if data['sortOrder'] == '^':
        query = query + ' DESC'
    cursor.execute(query, ({item_ex}))
    data = cursor.fetchall()
    response = []
    for a in data:
        response.append({'name': a[0], 'page': a[1], 'year': a[2], 'author': a[3], 'about': a[4], 'pdf': a[5], 'image': a[6]})
    conn.commit()
    conn.close()
    return response


@books_bp.route('/readlogin', methods=['GET', 'POST'])
@jwt_required()
def readlogin():
    return get_jwt_identity()


@books_bp.route('/files/<string:filename>', methods=['GET'])
def get_pdf(filename):
    return send_file(os.getcwd() + "/app/books/files/" + filename, as_attachment=True)


@books_bp.route('/images/<string:filename>', methods=['GET'])
def get_image(filename):
    return send_file(os.getcwd() + "/app/books/images/" + filename, as_attachment=True)


@books_bp.route('/purchase', methods=['GET', 'POST'])
def purchase():
    conn = mysql.connect()
    cursor = conn.cursor()
    data = request.json['data']
    cursor.execute(f'INSERT IGNORE INTO books_users SET book=%s, user=%s', ({data['book']}, {data['user']}))
    conn.commit()
    conn.close()
    return '1'


@books_bp.route('/get_books_by_categories', methods=['GET', 'POST'])
def get_books_by_categories():
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute('SELECT DISTINCT name FROM categories')
    categories = cursor.fetchall()
    response = {}
    for a in categories:
        cursor.execute('SELECT book FROM categories AS c WHERE c.name = %s', ({a[0]}))
        book_names = cursor.fetchall()
        books = []
        for i in book_names:
            cursor.execute('SELECT * FROM books WHERE name = %s', ({i}))
            book = cursor.fetchall()[0]
            books.append({'name': book[0], 'page': book[1], 'year': book[2], 'author': book[3], 'about': book[4], 'pdf': book[5], 'image': book[6]})
        response[a[0]] = books
    conn.commit()
    conn.close()
    return response


@books_bp.route('/get_books_by_authors', methods=['GET', 'POST'])
def get_books_by_authors():
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute('SELECT DISTINCT author FROM books')
    categories = cursor.fetchall()
    response = {}
    for i in categories:
        cursor.execute('SELECT * FROM books AS b WHERE b.author = %s', ({i[0]}))
        books_lists = cursor.fetchall()
        books = []
        for a in books_lists:
            books.append({'name': a[0], 'page': a[1], 'year': a[2], 'author': a[3], 'about': a[4], 'pdf': a[5], 'image': a[6]})
        response[i[0]] = books
    conn.commit()
    conn.close()
    return response


@books_bp.route('/get_categories', methods=['GET', 'POST'])
def get_categories():
    conn = mysql.connect()
    cursor = conn.cursor()
    book = request.json['data']
    if book == '':
        return []
    cursor.execute('SELECT name FROM categories AS b WHERE b.book = %s', ({book}))
    data = cursor.fetchall()
    response = []
    for a in data:
        response.append(a[0])
    conn.commit()
    conn.close()
    return response
