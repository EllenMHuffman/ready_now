"""Ready Now web app"""

from jinja2 import StrictUndefined
import json

from flask import Flask, render_template, redirect, request, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension

from models import (User, Session, Activity, Record, Friend, Destination, db,
                    connect_to_db)
from helper_functions import (update_db, verify_user, create_activity_times,
                              get_user_avg, convert_to_datetime)

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
    # activity time = {act_id: {'name':'name', 'time':'time', 'clicked':'t/f'}, ...}

    if 'user_id' in session:
        user_id = session['user_id']

        activity_time = get_user_avg(user_id, activity_time)

    return jsonify(activity_time)


@app.route('/api/add-record', methods=['POST'])
def add_record():
    """Updates the database each time a user completes an activity."""

    timer_data = json.loads(request.data)
    sess_id = session['sess_id']
    act_id = timer_data['act_id']
    js_start = timer_data['start_t']
    start_t = convert_to_datetime(js_start)
    js_end = timer_data['end_t']
    end_t = convert_to_datetime(js_end)

    # Log records on guest account
    user_id = 1

    # Log records on user's account
    if 'user_id' in session:
        user_id = session['user_id']

    new_record = Record(user_id=user_id, sess_id=sess_id, act_id=act_id,
                        start_t=start_t, end_t=end_t)
    update_db(new_record)

    return 'attempted Record update'


@app.route('/api/register', methods=['POST'])
def register_user():
    """Creates a new user, adds them to the database, and logs them in."""

    new_user = User.create_user(request.form)
    result = User.query.filter(User.username == new_user.username)

    if result.count() == 0:
        update_db(new_user)
        session['user_id'] = new_user.user_id
        return redirect('/')

    return redirect('/register?validation=False')


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


@app.route('/profile')
def show_user_page():
    """Shows user profile page when logged in."""

    if 'user_id' in session:
        user_id = session['user_id']

        user = User.query.filter(User.user_id == user_id).one()
        return render_template('profile.html', user=user)

    return redirect('/')


################################################################################

if __name__ == '__main__':
    app.debug = True
    # make sure templates, etc. are not cached in debug mode
    app.jinja_env.auto_reload = app.debug

    connect_to_db(app)

    # Use the DebugToolbar
    DebugToolbarExtension(app)

    app.run(port=5000, host='0.0.0.0')
