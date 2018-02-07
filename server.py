"""Ready Now web app"""

from jinja2 import StrictUndefined

from flask import Flask, render_template, redirect, request, session
from flask_debugtoolbar import DebugToolbarExtension

from models import User, Session, Activity, Record, Friend, Destination, \
    connect_to_db, db
from user_validation import register_user, login_user


app = Flask(__name__)

# Key required to run Flask sessions and for debug toolbar
app.secret_key = 'getready'

# Raise error if undefined variable is used in Jinja2
app.jinja_env.undefined = StrictUndefined

################################################################################


@app.route('/')
def show_homepage():
    """Displays the homepage for Ready Now."""

    return render_template('homepage.html')


@app.route('/timer', methods=['POST'])
def show_timer_page():
    """Shows activities selected by user and their countdown timers."""

    act_ids = request.form.getlist('activity')

    activities = Activity.query.filter(Activity.act_id.in_(act_ids)).all()

    return render_template('timer.html', activities=activities)


@app.route('/register')
def show_register_page():
    """Shows registration page."""

    validation = request.args.get('validation')
    return render_template('register.html', validation=validation)


@app.route('/register', methods=['POST'])
def render_register_user():
    """Registers a new user and adds them to the database."""

    validation = register_user()

    if validation:
        return render_template('homepage.html', validation=validation)

    return redirect('/register?validation=False')


@app.route('/login')
def show_login_page():
    """Shows login page."""

    validation = request.args.get('validation')
    return render_template('login.html', validation=validation)


@app.route('/login', methods=['POST'])
def render_login_user():
    """Logs in a user by validating username and password."""

    validation = login_user()

    if validation:
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

    user_id = session['user_id']

    user = User.query.filter(User.user_id == user_id).one()
    return render_template('profile.html', user=user)


################################################################################

if __name__ == '__main__':
    app.debug = True
    # make sure templates, etc. are not cached in debug mode
    app.jinja_env.auto_reload = app.debug

    connect_to_db(app)

    # Use the DebugToolbar
    DebugToolbarExtension(app)

    app.run(port=5000, host='0.0.0.0')
