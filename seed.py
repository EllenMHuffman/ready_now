"""Utility file to seed readynow database with dummy data in seed_data/"""

import models
from models import User, Session, Activity, Record, Friend, Destination, \
    connect_to_db, db
from server import app

################################################################################


def load_activities():
    """Reads in activities.txt and adds to database"""

    # Delete existing data before loading new data
    Activity.query.delete()

    # Read in activities.txt file and insert data
    with open('seed_data/activities.txt') as f:
        for row in f:
            row = row.strip()
            activity, time = row.split('|')

            entry = Activity(act_name=activity, default_time=time)

            db.session.add(entry)

    db.session.commit()


################################################################################

if __name__ == '__main__':
    connect_to_db(app)

    db.create_all()

    load_activities()

#########
# After my database is loaded with the dummy data I want, I need to do:
# >>>pg_dump dbname > outfile
# add resulting sql file to repo
