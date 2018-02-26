"""Ready Now web app"""

from jinja2 import StrictUndefined
import json

from flask import Flask, render_template, request, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from sqlalchemy.sql import func
from sqlalchemy import exc


from models import (User, Session, Activity, Record, Friend, Destination, db,
                    connect_to_db)
from helper_functions import (create_user, update_db, verify_user,
                              create_activity_times, get_user_avg,
                              convert_to_datetime, clean_phone_number,
                              twilio_ping, create_friend_info)

app = Flask(__name__)

# Key required to run Flask sessions and for debug toolbar
app.secret_key = 'getready'

# Raise error if undefined variable is used in Jinja2
app.jinja_env.undefined = StrictUndefined

################################################################################


@app.route('/')
def show_index():
    """Renders the main app page."""

    return render_template('index.html')


@app.route('/api/get-activities', methods=['POST'])
def get_activities():
    """Gets list of activities from the database, including user times."""

    activities = db.session.query(Activity.act_id, Activity.act_name,
                                  Activity.default_time)

    activity_time = create_activity_times(activities)

    if 'user_id' in session:
        user_id = session['user_id']

        activity_time = get_user_avg(user_id, activity_time)

    return jsonify(activity_time)


@app.route('/api/add-session', methods=['POST'])
def add_session():
    """Creates new session for later use in user activity records."""

    # Log sessions on guest account
    user_id = 1

    if 'user_id' in session:
        user_id = session['user_id']

    new_session = Session(user_id=user_id)

    value = update_db(new_session)
    session['sess_id'] = new_session.sess_id

    return jsonify({'value': value})


@app.route('/api/add-record', methods=['POST'])
def add_record():
    """Updates the database each time a user completes an activity."""

    timer_data = json.loads(request.data)
    sess_id = session['sess_id']
    act_id = timer_data['actId']
    js_start = timer_data['startTime']
    start_t = convert_to_datetime(js_start)
    js_end = timer_data['endTime']
    end_t = convert_to_datetime(js_end)

    # Log records on guest account
    user_id = 1

    # Log records on user's account
    if 'user_id' in session:
        user_id = session['user_id']

    new_record = Record(user_id=user_id, sess_id=sess_id, act_id=act_id,
                        start_t=start_t, end_t=end_t)
    value = update_db(new_record)

    return jsonify({'value': value})


@app.route('/api/register', methods=['POST'])
def register_user():
    """Creates a new user, adds them to the database, and logs them in."""

    user_data = json.loads(request.data)
    new_user = create_user(user_data)

    try:
        update_db(new_user)

    except exc.IntegrityError as e:
        print e
        return jsonify({'value': False})

    session['user_id'] = new_user.user_id
    return jsonify({'value': True})


@app.route('/api/validate-user', methods=['POST'])
def validate_user():
    """Check if user is logged in."""

    if 'user_id' in session:
        return jsonify({'value': True})

    return jsonify({'value': False})


@app.route('/api/login', methods=['POST'])
def login_user():
    """Logs in a user after validating username and password."""

    user_data = json.loads(request.data)
    username = (user_data['username']).lower()
    password = user_data['password']

    user = User.query.filter(User.username == username).first()

    validation = verify_user(user, password)

    if validation:
        session['user_id'] = user.user_id
        return jsonify({'value': True})

    return jsonify({'value': False})


@app.route('/api/logout')
def logout_user():
    """Logs the user out of the app."""

    try:
        del session['user_id']
    except KeyError:
        pass

    return jsonify({'value': False})


@app.route('/api/profile', methods=['POST'])
def show_user_page():
    """Shows user profile page when logged in."""

    if 'user_id' in session:
        user_id = session['user_id']

        user_info = (db.session.query(User.fname, User.lname, User.username)
                               .filter(User.user_id == user_id).first())
        user_recs = (db.session.query(Record.sess_id,
                                      Record.act_id,
                                      func.avg(Record.end_t - Record.start_t)
                               .label('diff')).filter(Record.user_id == user_id)
                       .group_by(Record.sess_id, Record.act_id).all())

        # NEED TO WRITE HELPER FUNCTION TO CONVERT DB OBJECTS INTO DICTS
        # OR MAYBE IT SHOULD BE CLASS METHODS?

        return jsonify({'user_info': user_info, 'user_records': user_recs})

    return jsonify({'value': False})


@app.route('/api/add-friend', methods=['POST'])
def add_friend():
    """Add contact information for a friend into the database."""

    friend_data = json.loads(request.data)
    name = friend_data['name']
    phone = clean_phone_number(friend_data['phone'])
    value = False

    if 'user_id' in session:
        user_id = session['user_id']

        new_friend = Friend(user_id=user_id, name=name, phone=phone)
        value = update_db(new_friend)

    return jsonify({'value': value})


@app.route('/api/get-friends', methods=['POST'])
def list_friends():
    """List given user's friend information."""

    if 'user_id' in session:
        user_id = session['user_id']

        friends = db.session.query(Friend.friend_id, Friend.name, Friend.phone
                                   ).filter(Friend.user_id == user_id).all()

        friend_phone = create_friend_info(friends)

        return jsonify(friend_phone)

    return jsonify({'value': False})


@app.route('/api/text-friend', methods=['POST'])
def text_friend():
    """Send sms to user's specified friend with provided message."""

    text_data = json.loads(request.data)

    try:
        phone = text_data['phone']
    except KeyError as e:
        print e
        return jsonify({'value': False})

    message = text_data['message']

    value = twilio_ping(phone, message)

    return jsonify({'value': value})


################################################################################

if __name__ == '__main__':
    app.debug = True
    # make sure templates, etc. are not cached in debug mode
    app.jinja_env.auto_reload = app.debug

    connect_to_db(app)

    # Use the DebugToolbar
    DebugToolbarExtension(app)

    app.run(port=5000, host='0.0.0.0')
