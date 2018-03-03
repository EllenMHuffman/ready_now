import os
from models import db, Record, User
from datetime import timedelta
from flask import session
from sqlalchemy.sql import func
from datetime import datetime
from twilio.rest import Client
import bcrypt
import re

################################################################################


def create_user(user_data):
    """Instantiates a User object given user registration data.

        >>> from werkzeug import ImmutableMultiDict

        >>> info = ImmutableMultiDict({'username': 'newuser', 'password':\
                                       'newpassword'})
        >>> new_user = create_user(info)
        >>> new_user.username
        'newuser'

    """

    fname = user_data.get('fname', None)
    lname = user_data.get('lname', None)
    username = (user_data['username']).lower()
    password = user_data['password']
    gender = user_data.get('gender', None)
    phone = clean_phone_number(user_data.get('phone', ''))
    street = user_data.get('street', None)
    city = user_data.get('city', None)
    state = user_data.get('state', None)
    zipcode = user_data.get('zipcode', None)

    hashed_password = bcrypt.hashpw(password.encode('utf-8'),
                                    bcrypt.gensalt(10))

    return User(fname=fname, lname=lname, username=username,
                password=hashed_password, gender=gender, phone=phone,
                street=street, city=city, state=state, zipcode=zipcode)


def update_db(new_row):
    """Adds new user to database."""

    try:
        db.session.add(new_row)
    except:
        return False

    db.session.commit()
    return True


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
    """Takes list of activity tuples and creates a dictionary of name and time.

        >>> create_activity_times([(1, 'Shower', 600), (3, 'Shave', 300)])
        {1: {'clicked': False, 'name': 'Shower', 'time': 600}, 3: {'clicked': False, 'name': 'Shave', 'time': 300}}

    """

    activity_time = {}

    for act_id, act_name, default_time in activities:
        activity_time[act_id] = {'name': act_name,
                                 'time': default_time,
                                 'clicked': False}

    return activity_time


def create_user_activity_names(activities):
    """Takes list of activity tuples and creates a dictionary of name."""

    activity_name = {}

    for act_id, act_name in activities:
        activity_name[act_id] = {'name': act_name}

    return activity_name


def get_user_avg(user_id, activity_time):
    """Calculates avg user time for exisiting activities, updates dictionary."""

    records = db.session.query(Record.act_id,
                               func.avg(Record.end_t - Record.start_t).label
                               ('diff')).filter(Record.user_id == user_id)

    avg_diffs = records.group_by(Record.act_id).all()

    for act_id, timedelta in avg_diffs:
        activity_time[act_id]['time'] = int(timedelta.total_seconds())

    return activity_time


def convert_to_datetime(unix_seconds):
    """Takes integer of JavaScript time and converts to datetime object.

        >>> convert_to_datetime(15192000000)
        datetime.datetime(2451, 6, 1, 8, 0)

    """

    return datetime.fromtimestamp(unix_seconds)


def clean_phone_number(number_string):
    """Takes user input phone number and returns a string of only digits.

        >>> clean_phone_number('(555) 876-5432')
        '5558765432'
    """

    return re.sub("[^0-9]", "", number_string)


def twilio_ping(phone, message):
    """Send given message to given phone number via Twilio API."""

    ACCOUNT_SID = os.environ['ACCOUNT_SID']
    AUTH_TOKEN = os.environ['AUTH_TOKEN']
    MY_PHONE = phone
    TWILIO_PHONE = os.environ['TWILIO_PHONE']

    client = Client(ACCOUNT_SID, AUTH_TOKEN)

    try:
        message = client.messages.create(
            to=MY_PHONE,
            from_=TWILIO_PHONE,
            body=message)

        return True

    except:
        return False


def create_friend_info(friends):
    """Takes list of friend tuples and creates a dictionary of name and phone.

        >>> create_friend_info([])
        {}

    """

    friend_phone = []

    for friend_id, name, phone in friends:
        friend_phone.append({'name': name, 'phone': phone, 'id': friend_id})

    return friend_phone


def create_dest_info(dests):
    """Takes list of destination tuples and creates dict of info."""

    dest_info = {}

    for dest_id, name, street, city, state, zipcode in dests:
        dest_info[dest_id] = {'name': name,
                              'street': street,
                              'city': city,
                              'state': state,
                              'zipcode': zipcode,
                              'selected': False}

    return dest_info


def find_min_max_dates(user_recs, input_name):
    """Take in a set of user records and store min, max days in session."""

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

    return min_day, max_day


def create_tick_labels(min_day, max_day):
    """Create tick labels for each day between given min and max dates."""

    dates = []
    date_range = max_day - min_day
    for i in range(date_range.days + 1):
        tick_date = (min_day + timedelta(days=i)).strftime('%b %d, %Y')
        dates.append(tick_date)

    return dates
