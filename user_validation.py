from flask import request
from models import User, db
import bcrypt


def register_user(request_form):
    """Checks for existing username and adds new user to database."""

    new_user = User.create_user(request_form)
    result = User.query.filter(User.username == new_user.username)

    if result.count() == 0:
        db.session.add(new_user)
        db.session.commit()
        return True, new_user

    return False, None


def verify_user(request_form):
    """Verifies that given username and password match database."""

    username = (request_form.get('username')).lower()
    password = request_form.get('password')

    user = User.query.filter(User.username == username).first()

    if user is None:
        return False, None

    hashed = user.password

    validPassword = bcrypt.hashpw(password.encode('utf-8'),
                                  hashed.encode('utf-8')) == hashed

    if validPassword:
        return True, user

    return False, None
