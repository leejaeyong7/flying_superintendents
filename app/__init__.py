
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager
from flask.ext.mail import Mail

app = Flask(__name__)

app.debug = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost:5000/point_cloud_server'
app.config['LOGIN_DISABLED'] = False
app.config['TESTING'] = False
app.secret_key = 'test'
from database import db
#db.init_app(app)
db.create_all()

from login import login_manager
login_manager.init_app(app)
login_manager.login_view = '/index'

mail = Mail()
mail.init_app(app)

from app import views

