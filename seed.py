"""Utility file to seed readynow database with dummy data in seed_data/"""

from models import (User, Session, Activity, Record, Friend, Destination,
                    connect_to_db, db)
from helper_functions import clean_phone_number
from server import app
import bcrypt

################################################################################


def load_activities():
    """Reads in activities.txt and adds to database."""

    # Read in activities.txt file and insert data
    with open('seed_data/activities.txt') as f:
        for row in f:
            row = row.strip()
            activity, time, pair, img = row.split('|')

            entry = Activity(act_name=activity, default_time=time,
                             pair=int(pair), img=img)

            db.session.add(entry)

    db.session.commit()


def load_users():
    """Reads in users.txt and adds to database."""

    with open('seed_data/users.txt') as f:
        for row in f:
            row = row.strip()
            fname, lname, username, password, gender, phone, street, city, \
                state, zipcode = row.split('|')

            hashed_password = bcrypt.hashpw(password, bcrypt.gensalt(10))

            entry = User(fname=fname, lname=lname, username=username, password=
                         hashed_password, gender=gender, phone=phone,
                         street=street, city=city, state=state, zipcode=zipcode)

            db.session.add(entry)

    db.session.commit()


def load_sessions():
    """Reads in sessions.txt and adds to database."""

    with open('seed_data/sessions.txt') as f:
        for row in f:
            user_id = row.strip()

            entry = Session(user_id=user_id)

            db.session.add(entry)

    db.session.commit()


def load_records():
    """Reads in records.txt and adds to database."""

    with open('seed_data/records.txt') as f:
        for row in f:
            row = row.strip()
            user_id, sess_id, act_id, start_t, end_t = row.split('|')

            entry = Record(user_id=user_id, sess_id=sess_id,
                           act_id=act_id, start_t=start_t, end_t=end_t)

            db.session.add(entry)

    db.session.commit()


def load_friends():
    """Reads in friends.txt and adds to database."""

    with open('seed_data/friends.txt') as f:
        for row in f:
            row = row.strip()
            user_id, name, raw_phone = row.split('|')

            phone_split = raw_phone.split('x')
            phone = clean_phone_number(phone_split[0])

            entry = Friend(user_id=user_id, name=name, phone=phone)

            db.session.add(entry)

    db.session.commit()


def load_destinations():
    """Reads in destinations.txt and adds to database."""

    with open('seed_data/destinations.txt') as f:
        for row in f:
            row = row.strip()
            user_id, name, street, city, state, zipcode = row.split('|')

            entry = Destination(user_id=user_id, name=name, street=street,
                                city=city, state=state, zipcode=zipcode)

            db.session.add(entry)

    db.session.commit()


################################################################################

if __name__ == '__main__':
    connect_to_db(app)
    db.create_all()

    load_users()
    load_activities()
    load_sessions()
    load_records()
    load_friends()
    load_destinations()
