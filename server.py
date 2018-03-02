"""Ready Now web app"""

from jinja2 import StrictUndefined
import json

from flask import Flask, render_template, request, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from sqlalchemy.sql import func
from sqlalchemy import exc
from datetime import timedelta


from models import (User, Session, Activity, Record, Friend, Destination, db,
                    connect_to_db)
from helper_functions import (create_user, update_db, verify_user,
                              create_activity_times, get_user_avg,
                              convert_to_datetime, clean_phone_number,
                              twilio_ping, create_friend_info,
                              create_user_activity_names)

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


@app.route('/api/get-user-info', methods=['POST'])
def get_user_info():
    """Retrieves user info when logged in."""

    if 'user_id' in session:
        user_id = session['user_id']

        user_info = (db.session.query(User.fname, User.lname, User.username)
                       .filter(User.user_id == user_id).first())
        return user_info


@app.route('/api/get-average-times', methods=['POST'])
def get_user_activity_averages():
    """Retrieves user average activity times when logged in."""

    if 'user_id' in session:
        user_id = session['user_id']

        user_recs = (db.session.query(
            func.avg(Record.end_t - Record.start_t).label('diff'),
            Activity.act_name)
            .join(Activity)
            .filter(Record.user_id == user_id)
            .group_by(Activity.act_name).all())

        activity_averages = []

        for time_delta, act_name in user_recs:
            activity_averages.append({'x': act_name,
                                      'y': time_delta.total_seconds()/60})

        return json.dumps({'activityAverages': activity_averages})

    return jsonify({'value': False})


@app.route('/api/get-user-activities', methods=['POST'])
def get_user_activities():
    """Get list of activities that user has completed."""

    user_id = session['user_id']

    activities = (db.session.query(Record.act_id, Activity.act_name)
                    .join(Activity)
                    .filter(Record.user_id == user_id)
                    .distinct())

    activity_name = create_user_activity_names(activities)

    return jsonify({'activityNames': activity_name})


@app.route('/api/get-activity-session-time', methods=['POST'])
def get_activity_session_time():
    """Retrieves user's specified activity time for each session."""

    user_id = session['user_id']

    act_id, input_name = json.loads(request.data)

    user_recs = (db.session.query(
        (Record.end_t - Record.start_t).label('diff'),
        Record.start_t)
        .filter((Record.user_id == user_id) & (Record.act_id == act_id))
        .order_by(Record.sess_id).all())

    session_times = []

    for _, start_t in user_recs:
        session_times.append(start_t)

    min_day = min(session_times)
    max_day = max(session_times)
    session['session_range'] = session.get('session_range', {})
    session['session_range'][input_name] = {'min_day': min_day, 'max_day': max_day}

    if len(session['session_range']) > 1:
        min_days = []
        max_days = []
        for activity in session['session_range']:
            min_days.append(session['session_range'][activity]['min_day'])
            max_days.append(session['session_range'][activity]['max_day'])
        min_day = min(min_days)
        max_day = max(max_days)

    dates = []
    date_range = max_day - min_day
    for i in range(date_range.days + 1):
        tick_date = (min_day + timedelta(days=i)).strftime('%b %d, %Y')
        dates.append(tick_date)

    activity_sessions = []

    for time_delta, start_t in user_recs:
        tick_int = start_t - min_day
        activity_sessions.append({'x': tick_int.days,
                                  'y': (time_delta.total_seconds() / 60)})
    return json.dumps(
        {'activitySessions': activity_sessions,
         'startTimes': dates})


################################################################################

if __name__ == '__main__':
    app.debug = True
    # make sure templates, etc. are not cached in debug mode
    app.jinja_env.auto_reload = app.debug

    connect_to_db(app)

    # Use the DebugToolbar
    DebugToolbarExtension(app)

    app.run(port=5000, host='0.0.0.0')
