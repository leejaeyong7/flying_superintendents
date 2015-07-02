from flask.ext.login import LoginManager
from database import User
login_manager = LoginManager()

@login_manager.user_loader
def load_user(userid):
    return User.query.get(userid)
