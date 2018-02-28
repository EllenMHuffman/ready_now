"""Models and database functions for Ready Now project"""

from flask_sqlalchemy import SQLAlchemy
import json

db = SQLAlchemy()
################################################################################


class ToDictMixin(object):
    """Convert an object into a dict with attributes"""

    def to_dict(self):

        object_info = {}

        # loop through columns, set key as column name and value as attribute value
        for column_name in self.__mapper__.column_attrs.keys():
            attribute = getattr(self, column_name, None)
            object_info[column_name] = attribute

        return object_info

    def to_json(self):

        return json.dumps(self.to_dict())


class User(db.Model):
    """Users of Ready Now web app."""

    __tablename__ = 'users'

    user_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    fname = db.Column(db.String(25), nullable=True)
    lname = db.Column(db.String(25), nullable=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
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

    def __repr__(self):
        """Display user information"""

        return '<User user_id={} username={}>'.format(self.user_id,
                                                      self.username)


class Session(db.Model):
    """The session of activities each time a user uses the app."""

    __tablename__ = 'sessions'

    sess_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'),
                        nullable=False)

    records = db.relationship('Record', backref='session')

    def __repr__(self):
        """Display session information"""

        return '<Session sess_id={} user_id={}>'.format(self.sess_id,
                                                        self.user_id)


class Activity(db.Model, ToDictMixin):
    """The various activities users can select for each session.

    default_time is stored in seconds"""

    __tablename__ = 'activities'

    act_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    act_name = db.Column(db.String(25), nullable=False)
    default_time = db.Column(db.Integer, nullable=False)

    records = db.relationship('Record', backref='activity')

    def __repr__(self):
        """Display activity information"""

        return '<Activity act_id={} act_name={} default_time={}>'.format(
            self.act_id, self.act_name, self.default_time)


class Record(db.Model, ToDictMixin):
    """Records of each activity completed by users."""

    __tablename__ = 'records'

    record_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'),
                        nullable=False)
    sess_id = db.Column(db.Integer, db.ForeignKey('sessions.sess_id'),
                        nullable=False)
    act_id = db.Column(db.Integer, db.ForeignKey('activities.act_id'),
                       nullable=False)
    start_t = db.Column(db.DateTime, nullable=False)
    end_t = db.Column(db.DateTime, nullable=False)

    def __repr__(self):
        """Display record information"""

        return '<Record record_id={} user_id={} sess_id={} act_id={} start_t={}\
             end_t={}>'.format(self.record_id, self.user_id, self.sess_id,
                               self.act_id, self.start_t, self.end_t)


class Friend(db.Model):
    """Friends of users who recieve text notifications."""

    __tablename__ = 'friends'

    friend_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'),
                        nullable=False)
    name = db.Column(db.String(25), nullable=False)
    phone = db.Column(db.String(20), nullable=False)

    def __repr__(self):
        """Display friend information"""

        return '<Friend friend_id={} user_id={} name={} phone={}>'.\
            format(self.friend_id, self.user_id, self.name, self.phone)


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

    def __repr__(self):
        """Display destination information"""

        return '<Destination dest_id={} user_id={} name={} street={} city={} \
            state={} zipcode={}>'.format(self.dest_id, self.user_id, self.name,
                                         self.street, self.city, self.state,
                                         self.zipcode)

################################################################################


def connect_to_db(app, db_uri='postgresql:///readynow'):
    """Connect the database to Flask app"""

    app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    app.config['SQLACHEMY_ECHO'] = True
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.app = app
    db.init_app(app)


if __name__ == '__main__':

    from server import app

    connect_to_db(app)
    db.create_all()
