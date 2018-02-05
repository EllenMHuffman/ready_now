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

    def __repr__(self):
        """Display user information"""

        return '<User user_id={} name={} {}>'.format(self.user_id, self.fname,
                                                     self.lname)


class Session(db.Model):
    """The session of activities each time a user uses the app."""

    __tablename__ = 'sessions'

    sess_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.String(25), db.ForeignKey('users.user_id'),
                        nullable=False)

    records = db.relationship('Record', backref='session')

    def __repr__(self):
        """Display session information"""

        return '<Session sess_id={} user_id={}>'.format(self.sess_id,
                                                        self.user_id)


class Activity(db.Model):
    """The various activities users can select for each session."""

    __tablename__ = 'activities'

    act_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    act_name = db.Column(db.String(25), nullable=False)
    default_time = db.Column(db.Integer, nullable=False)

    records = db.relationship('Record', backref='activity')

    def __repr__(self):
        """Display activity information"""

        return '<Activity act_id={} act_name={} default_time={}>'.\
            format(self.user_id, self.fname, self.lname)


class Record(db.Model):
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
                               self.start_t, self.end_t)


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
