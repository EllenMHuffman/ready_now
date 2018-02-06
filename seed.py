"""Utility file to seed readynow database with dummy data in seed_data/"""

import models
from models import User, Session, Activity, Record, Friend, Destination, \
    connect_to_db, db
from server import app

################################################################################


def load_activities():
    """Reads in activities.txt and adds to database."""

    # Delete existing data before loading new data
    Activity.query.delete()

    # Read in activities.txt file and insert data
    with open('seed_data/activities.txt') as f:
        for row in f:
            row = row.strip()
            activity, time = row.split('|')

            entry = Activity(act_name=activity, default_time=time)

            db.session.add(entry)

    db.session.commit()


def load_users():
    """Reads in users.txt and adds to database."""

    User.query.delete()

    with open('seed_data/users.txt') as f:
        for row in f:
            row = row.strip()
            fname, lname, username, password, gender, phone, street, city, \
                state, zipcode = row.split('|')

            entry = User(fname=fname, lname=lname, username=username, password=
                         password, gender=gender, phone=phone, street=street,
                         city=city, state=state, zipcode=zipcode)

            db.session.add(entry)

    db.session.commit()


def load_sessions():
    """Reads in sessions.txt and adds to database."""

    Session.query.delete()

    with open('seed_data/sessions.txt') as f:
        for row in f:
            row = row.strip()
            sess_id, user_id = row.split('|')

            entry = Session(sess_id=sess_id, user_id=user_id)

            db.session.add(entry)

    db.session.commit()


def load_records():
    """Reads in records.txt and adds to database."""

    Record.query.delete()

    with open('seed_data/records.txt') as f:
        for row in f:
            row = row.strip()
            user_id, sess_id, act_id, start_t, end_t = row.split('|')

            entry = Record(user_id=user_id, sess_id=sess_id, act_id=act_id,
                           start_t=start_t, end_t=end_t)

            db.session.add(entry)

    db.session.commit()


def load_friends():
    """Reads in friends.txt and adds to database."""

    pass


def load_destinations():
    """Reads in destinations.txt and adds to database."""

    pass


################################################################################

if __name__ == '__main__':
    connect_to_db(app)

    db.create_all()

    load_users()
    load_activities()
    load_sessions()
    load_records()

#########
# After my database is loaded with the dummy data I want, I need to do:
# >>>pg_dump dbname > outfile
# add resulting sql file to repo
