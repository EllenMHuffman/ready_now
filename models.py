"""Models and database functions for Ready Now project"""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
################################################################################


class User(db.Model):
    """Users of Ready Now web app."""

    __tablename__ = 'users'

    user_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    fname = db.Column(db.String(25), nullable=False)
    lname = db.Column(db.String(25), nullable=False)
    username = db.Column(db.String(50), default=fname + lname)
    password = db.Column(db.String(12), nullable=False)
    gender = db.Column(db.String(15), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    street = db.Column(db.String(30), nullable=True)
    city = db.Column(db.String(20), nullable=True)
    state = db.Column(db.String(2), nullable=True)
    zipcode = db.Column(db.String(5), nullable=True)

    sessions = db.relationship('Session', backref='user')
    records = db.relationship('Record', backref='user')
    friends = db.relationship('Friend', backref='user')
    destinations = db.relationship('Destination', backref='user')


class Session(db.Model):
    """The session of activities each time a user uses the app."""

    __tablename__ = 'sessions'

    sess_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.String(25), db.ForeignKey('users.user_id'),
                        nullable=False)

    records = db.relationship('Record', backref='session')


class Activity(db.Model):
    """The various activities users can select for each session."""

    __tablename__ = 'activities'

    act_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    act_name = db.Column(db.String(25), nullable=False)
    default_time = db.Column(db.Integer, nullable=False)

    records = db.relationship('Record', backref='activity')


class Record(db.Model):
    """Records of each activity completed by users."""

    __tablename__ = 'records'

    record_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'),
                        nullable=False)
    session_id = db.Column(db.Integer, db.ForeignKey('sessions.sess_id'),
                           nullable=False)
    act_id = db.Column(db.Integer, db.ForeignKey('activities.act_id'),
                       nullable=False)
    start_t = db.Column(db.DateTime, nullable=False)
    end_t = db.Column(db.DateTime, nullable=False)


class Friend(db.Model):
    """Friends of users who recieve text notifications."""

    __tablename__ = 'friends'

    friend_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'),
                        nullable=False)
    name = db.Column(db.String(25), nullable=False)
    phone = db.Column(db.String(20), nullable=False)


class Destination(db.Model):
    """Destinations the users travel to when finished getting ready."""

    __tablename__ = 'destinations'

    dest_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'),
                        nullable=False)
    name = db.Column(db.String(25), nullable=False)
    street = db.Column(db.String(30), nullable=False)
    city = db.Column(db.String(20), nullable=False)
    state = db.Column(db.String(2), nullable=False)
    zipcode = db.Column(db.String(5), nullable=False)
