import os
import unittest
from Flask import session
from models import User, db, connect_to_db
from server import app
from seed import load_users, load_activities, load_sessions, load_records
from helper_functions import (update_db, verify_user, create_activity_times,
                              get_user_avg)

################################################################################
# DocTests

    >>> create_activity_times([(1, 'Shower', 600), (3, 'Shave', 300)])
    {1: {'name': 'Shower', 'time': 600, 'clicked': False},
     3: {'name': 'Shave', 'time': 300, 'clicked': False}}

################################################################################


class FlaskTestsDatabase(unittest.TestCase):
    """Flask tests that use the database."""

    def setUp(self):
        """Prepare for each test before execution."""

        connect_to_db(app, 'postgresql:///testdb')
        db.create_all()

        load_users()
        load_activities()
        load_sessions()
        load_records()

    def tearDown(self):
        """Execute at the end of each test."""

        db.session.close()
        db.drop_all()

    def test_update_db(self):
        """Test for successful addition of new user to database."""

        matt = User(username='matt', password='password')
        update_db(matt)

        result = User.query.filter(User.username == 'matt').first()

        self.assertEqual(matt.user_id, result.user_id)
        self.assertEqual(matt.username, result.username)
        self.assertEqual(matt.password, result.password)

    def test_verify_user_accept(self):
        """Test for validation of existing login credentials."""

        info = {'username': 'timmy', 'password': u'password'}
        timmy = User.create_user(info)
        boolean = verify_user(timmy, u'password')

        self.assertTrue(boolean)

    def test_verify_user_username(self):
        """Test for rejection of incorrect password in login credentials."""

        info = {'username': 'timmy', 'password': u'password'}
        timmy = User.create_user(info)
        boolean = verify_user(timmy, u'wrong')

        self.assertFalse(boolean)

    # def test_get_user_avg(self):
    #     """Test for dictionary creation from db query."""

    #     activity_time = {1: {'name': 'Shower', 'time': 600, 'clicked': False},
    #                      3: {'name': 'Shave', 'time': 300, 'clicked': False}}
    #     result = get_user_avg(1, activity_time)

    #     self.assertIn(2, result)


################################################################################


class FlaskTests(unittest.TestCase):
    """Flask tests for web app."""

    def setUp(self):
        """Prepare for each test before execution."""

        app.config['TESTING'] = True
        app.config['SECRET_KEY'] = 'key'
        self.client = app.test_client()

    def tearDown(self):
        """Execute at the end of each test."""

        pass

################################################################################


if __name__ == '__main__':
    unittest.main()
