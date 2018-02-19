from models import db, Record
from sqlalchemy.sql import func
from datetime import datetime
import bcrypt

################################################################################


def update_db(new_row):
    """Adds new user to database."""

    db.session.add(new_row)
    db.session.commit()
    return


def verify_user(user, password):
    """Verifies that given user exists and their password matches database."""

    if user is None:
        return False

    hashed = user.password
    validPassword = bcrypt.hashpw(password.encode('utf-8'),
                                  hashed.encode('utf-8')) == hashed

    if validPassword:
        return True

    return False


def create_activity_times(activities):
    """Takes a list of activities and creates a dictionary of name and time."""

    activity_time = {}

    for act_id, act_name, default_time in activities:
        activity_time[act_id] = {'name': act_name,
                                 'time': default_time,
                                 'clicked': False}

    return activity_time


def get_user_avg(user_id, activity_time):
    """Calculates avg user time for exisiting activities, updates dictionary."""

    records = db.session.query(Record.act_id,
                               func.avg(Record.end_t - Record.start_t).label
                               ('diff')).filter(Record.user_id == user_id)

    avg_diffs = records.group_by(Record.act_id).all()

    for act_id, timedelta in avg_diffs:
        activity_time[act_id]['time'] = int(timedelta.total_seconds())

    return activity_time


def get_user_avg_timer(user_id, activity_time, act_ids):
    """Calcuates avg user time for specified activities, updates dictionary."""

    records = db.session.query(Record.act_id,
                               func.avg(Record.end_t - Record.start_t).label
                               ('diff')).filter((Record.user_id == user_id) &
                                                (Record.act_id.in_(act_ids)))

    avg_diffs = records.group_by(Record.act_id).all()

    for act_id, timedelta in avg_diffs:
        activity_time[act_id]['time'] = int(timedelta.total_seconds())

    return activity_time


def convert_to_datetime(js_time):
    """Takes integer of JavaScript time and converts to datetime object."""

    return datetime.fromtimestamp(js_time/1000)
