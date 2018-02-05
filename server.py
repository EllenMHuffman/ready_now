"""Ready Now web app"""

from jinja2 import StrictUndefined

from flask import (Flask, render_template, redirect, request, flash, session)
from flask_debugtoolbar import DebugToolbarExtension

from models import User, Session, Activity, Record, Friend, Destination, \
    connect_to_db, db

app = Flask(__name__)

# Key required to run Flask sessions and for debug toolbar
app.secret_key = 'getready'

# Raise error if undefined variable is used in Jinja2
app.jinja_env.undefined = StrictUndefined
################################################################################

# ROUTES GO HERE

################################################################################

if __name__ == '__main__':
    app.debug = True
    # make sure templates, etc. are not cached in debug mode
    app.jinja_env.auto_reload = app.debug

    connect_to_db(app)

    # Use the DebugToolbar
    DebugToolbarExtension(app)

    app.run(port=5000, host='0.0.0.0')
