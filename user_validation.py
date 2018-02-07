from flask import request, session
from models import User, db
from sqlalchemy import exc
import bcrypt


def register_user():
    """Adds new user to database."""

    fname = request.form.get('fname')
    lname = request.form.get('lname')
    username = request.form.get('username')
    password = request.form.get('password')
    gender = request.form.get('gender')
    phone = request.form.get('phone')
    street = request.form.get('street')
    city = request.form.get('city')
    state = request.form.get('state')
    zipcode = request.form.get('zipcode')

    hashed_password = bcrypt.hashpw(password.encode('utf-8'),
                                    bcrypt.gensalt(10))

    try:
        new_user = User(fname=fname, lname=lname, username=username,
                        password=hashed_password, gender=gender, phone=phone,
                        street=street, city=city, state=state, zipcode=zipcode)
    except exc.IntegrityError:
        return False

    db.session.add(new_user)
    db.session.commit()

    session['user_id'] = new_user.user_id

    return True


def login_user():
    """Logs in a user by storing session data."""

    username = request.form.get('username')
    password = request.form.get('password')

    user = User.query.filter(User.username == username).first()

    if user is None:
        return False

    user_id = user.user_id
    hashed = user.password

    validPassword = bcrypt.hashpw(password.encode('utf-8'),
                                  hashed.encode('utf-8')) == hashed

    if validPassword:
        session['user_id'] = user_id
        return True

    return False
