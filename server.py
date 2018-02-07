"""Ready Now web app"""

from jinja2 import StrictUndefined

from flask import Flask, render_template, redirect, request, session
from flask_debugtoolbar import DebugToolbarExtension

from models import User, Session, Activity, UserActivity, Friend, Destination, \
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

    invalid = request.args.get('invalid')
    return render_template('homepage.html', invalid=invalid)


@app.route('/timer', methods=['POST'])
def show_timer_page():
    """Shows activities selected by user and their countdown timers."""

    act_ids = request.form.getlist('activity')

    activities = Activity.query.filter(Activity.act_id.in_(act_ids)).all()

    return render_template('timer.html', activities=activities)


@app.route('/register')
def show_register_page():
    """Shows registration page."""

    return render_template('register.html')


@app.route('/register', methods=['POST'])
def render_register_user():
    """Registers a new user and adds them to the database."""

    new_user = register_user()

    return render_template('user-info.html', user=new_user)


@app.route('/login')
def show_login_page():
    """Shows login page."""

    return render_template('login.html')


@app.route('/login', methods=['POST'])
def render_login_user():
    """Logs in a user by validating username and password."""

    validation, user_id = login_user()

    if validation:
        return redirect('/user/' + str(user_id))

    return redirect('/?invalid=True')


@app.route('/logout')
def logout_user():
    """Logs the user out of the app."""

    del session['user_id']

    return redirect('/')


@app.route('/user/<user_id>')
def show_user_page(user_id):
    """Shows user profile page when logged in."""

    user = User.query.filter(User.user_id == user_id).one()

    return render_template('user-info.html', user=user)

################################################################################

if __name__ == '__main__':
    app.debug = True
    # make sure templates, etc. are not cached in debug mode
    app.jinja_env.auto_reload = app.debug

    connect_to_db(app)

    # Use the DebugToolbar
    DebugToolbarExtension(app)

    app.run(port=5000, host='0.0.0.0')
