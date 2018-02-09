from models import db
import bcrypt

################################################################################


def add_user(new_user):
    """Adds new user to database."""

    db.session.add(new_user)
    db.session.commit()
    return


def verify_user(user, password):
    """Verifies that given user exists and their password matches database."""

    if user is None:
        return False

    hashed = user.password
    validPassword = bcrypt.hashpw(password.encode('utf-8'),
                                  hashed.encode('utf-8')) == hashed

    if validPassword:
        return True

    return False
