"""Ready Now web app"""

from jinja2 import StrictUndefined
import json

from flask import Flask, render_template, redirect, request, session
from flask_debugtoolbar import DebugToolbarExtension

from models import (User, Session, Activity, Record, Friend, Destination, db,
                    connect_to_db)
from helper_functions import (update_db, verify_user, create_activity_times,
                              get_user_avg, get_user_avg_timer)

app = Flask(__name__)

# Key required to run Flask sessions and for debug toolbar
app.secret_key = 'getready'

# Raise error if undefined variable is used in Jinja2
app.jinja_env.undefined = StrictUndefined

################################################################################


@app.route('/')
def show_homepage():
    """Displays the homepage for Ready Now."""

    activities = db.session.query(Activity.act_id, Activity.act_name,
                                  Activity.default_time)

    activity_time = create_activity_times(activities)
    # activity time = {act_id: [act_name, default_time], ...}

    if 'user_id' in session:
        user_id = session['user_id']

        activity_time = get_user_avg(user_id, activity_time)

    return render_template('homepage.html', activity_time=activity_time)


@app.route('/timer', methods=['POST'])
def show_timer_page():
    """Shows activities selected by user and their countdown timers."""

    # Assume user is on guest account
    user_id = 1

    act_ids = request.form.getlist('activity')

    activities = db.session.query(Activity.act_id, Activity.act_name,
                                  Activity.default_time).filter(
        Activity.act_id.in_(act_ids)).order_by(Activity.act_id).all()

    # activity_time = {act_id: [act_name, default_time]}
    activity_time = create_activity_times(activities)

    # If user is logged in, use their average activity times
    if 'user_id' in session:
        user_id = session['user_id']

        activity_time = get_user_avg_timer(user_id, activity_time, act_ids)

    activity_time = json.dumps(activity_time)

    # Update sessions table to obtain unique session ID
    new_session = Session(user_id=user_id)
    update_db(new_session)
    # Store sess_id in session for updating records later
    session['sess_id'] = new_session.sess_id

    return render_template('timer.html', activity_time=activity_time)


@app.route('/add-record', methods=['POST'])
def add_record():
    """Updates the database each time a user completes an activity."""

    timer_data = json.loads(request.data)
    sess_id = session['sess_id']
    act_id = timer_data['act_id']
    start_t = timer_data['start_t']
    end_t = timer_data['end_t']

    # Log records on guest account
    user_id = 1

    # Log records on user's account
    if 'user_id' in session:
        user_id = session['user_id']

    new_record = Record(user_id=user_id, sess_id=sess_id, act_id=act_id,
                        start_t=start_t, end_t=end_t)
    update_db(new_record)

    return 'attempted Record update'


@app.route('/register')
def show_register_page():
    """Shows registration page."""

    validation = request.args.get('validation')
    return render_template('register.html', validation=validation)


@app.route('/register', methods=['POST'])
def register_user():
    """Creates a new user, adds them to the database, and logs them in."""

    new_user = User.create_user(request.form)
    result = User.query.filter(User.username == new_user.username)

    if result.count() == 0:
        update_db(new_user)
        session['user_id'] = new_user.user_id
        return redirect('/')

    return redirect('/register?validation=False')


@app.route('/login')
def show_login_page():
    """Shows login page."""

    validation = request.args.get('validation')

    return render_template('login.html', validation=validation)


@app.route('/login', methods=['POST'])
def render_login_user():
    """Logs in a user after validating username and password."""

    username = (request.form.get('username')).lower()
    password = request.form.get('password')

    user = User.query.filter(User.username == username).first()

    validation = verify_user(user, password)

    if validation:
        session['user_id'] = user.user_id
        return redirect('/profile')

    return redirect('/login?validation=False')


@app.route('/logout')
def logout_user():
    """Logs the user out of the app."""

    try:
        del session['user_id']
    except KeyError:
        pass

    return redirect('/')


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
