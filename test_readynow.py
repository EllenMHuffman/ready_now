import json
import unittest
from Flask import session
from models import User, db, connect_to_db
from server import app
from seed import load_users, load_activities, load_sessions, load_records
from helper_functions import (update_db, verify_user, create_activity_times,
                              get_user_avg, convert_to_datetime, create_user)

################################################################################


################################################################################


class TestFlaskDatabase(unittest.TestCase):
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

        self.assertEqual(result.user_id, matt.user_id)
        self.assertEqual(result.username, matt.username)
        self.assertEqual(result.password, matt.password)

    def test_verify_user_accept(self):
        """Test for validation of existing login credentials."""

        info = {'username': 'timmy', 'password': u'password'}
        timmy = create_user(info)
        boolean = verify_user(timmy, u'password')

        self.assertTrue(boolean)

    def test_verify_user_password(self):
        """Test for rejection of incorrect password in login credentials."""

        info = {'username': 'timmy', 'password': u'password'}
        timmy = create_user(info)
        boolean = verify_user(timmy, u'wrong')

        self.assertFalse(boolean)

    def test_get_user_avg(self):
        """Test for dictionary creation from db query."""

        activity_time = {
            1: {'clicked': False, 'name': u'Shower', 'time': 600},
            2: {'clicked': False, 'name': u'Wash Hair', 'time': 600},
            3: {'clicked': False, 'name': u'Shave', 'time': 300},
            4: {'clicked': False, 'name': u'Wash Face', 'time': 300},
            5: {'clicked': False, 'name': u'Brush Teeth', 'time': 120},
            6: {'clicked': False, 'name': u'Skin Care', 'time': 300},
            7: {'clicked': False, 'name': u'Make Up (Simple)', 'time': 300},
            8: {'clicked': False, 'name': u'Make Up (Full Face)', 'time': 900},
            9: {'clicked': False, 'name': u'Hair Styling (Simple)', 'time': 600},
            10: {'clicked': False, 'name': u'Hair Styling (Heat)', 'time': 1200},
            11: {'clicked': False, 'name': u'Choose Clothes', 'time': 300},
            12: {'clicked': False, 'name': u'Dressing/Shoes', 'time': 300},
            13: {'clicked': False, 'name': u'Accessories', 'time': 180}
        }

        result = get_user_avg(1, activity_time)

        self.assertEqual(result.keys(), range(1, 14))
        self.assertEqual(result[1]['clicked'], False)
        self.assertEqual(result[6]['name'], u'Skin Care')
        self.assertEqual(result[13]['time'], 875)


################################################################################


class TestFlaskLoggedIn(unittest.TestCase):
    """Flask tests for logged in user on Ready Now web app."""

    def setUp(self):
        """Prepare for each test before execution."""

        self.app = app.test_client()
        app.config['TESTING'] = True
        app.config['SECRET_KEY'] = 'key'

        connect_to_db(app, 'postgresql:///testdb')

        db.create_all()
        load_users()
        load_activities()
        load_sessions()
        load_records()

        with self.app as c:
            with c.session_transaction() as sess:
                sess['user_id'] = 2
                sess['sess_id'] = 40

    def tearDown(self):
        """Execute at the end of each test."""

        db.session.close()
        db.drop_all()

    def test_api_get_activities(self):
        """Test for return of user's activity_time."""

        result = self.app.post('/api/get-activities')

        self.assertIn("Shower", result.data)
        self.assertIn("clicked", result.data)
        self.assertIn("time", result.data)
        self.assertIn("12", result.data)

    def test_api_add_session(self):
        """Test for database update for new session for later records."""

        result = self.app.post('/api/add-session')

        self.assertIn('true', result.data)

    def test_api_add_record(self):
        """Test for database update for each new user record."""

        data = {'act_id': 1, 'start_t': 15192000000000, 'end_t': 15192002000000}
        result = self.app.post('/api/add-record',
                               data=json.dumps(data),
                               content_type='application/json')

        self.assertIn('true', result.data)

    def test_api_validate_user_pass(self):
        """Test for True response when user is logged in."""

        result = self.app.post('/api/validate-user')

        self.assertIn('true', result.data)

    def test_api_logout(self):
        """Test for False response when user is logged out."""

        result = self.app.get('/api/logout')

        self.assertIn('false', result.data)

    # def test_api_profile_pass(self):
    #     """Test for user info returned when user is logged in."""

    #     result = self.app.post('/api/profile')

    #     self.assertIn('user_info', result.data)
    #     self.assertIn('user_records', result.data)


################################################################################


class TestsFlaskLoggedOut(unittest.TestCase):
    """Flask tests for guest user on Ready Now web app."""

    def setUp(self):
        """Prepare for each test before execution."""

        self.app = app.test_client()
        app.config['TESTING'] = True
        app.config['SECRET_KEY'] = 'key'

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

    def test_api_register_pass(self):
        """Test for successful registration of new username."""

        data = {'username': 'newuser', 'password': 'password'}
        result = self.app.post('/api/register',
                               data=json.dumps(data),
                               content_type='application/json')

        self.assertIn('true', result.data)

    def test_api_register_fail(self):
        """Test for rejected registration of existing username."""

        data = {'username': 'janedoe', 'password': 'password'}
        result = self.app.post('/api/register',
                               data=json.dumps(data),
                               content_type='application/json')

        self.assertIn('false', result.data)

    def test_api_validate_user_fail(self):
        """Test for False response when user is not logged in."""

        result = self.app.post('/api/validate-user')

        self.assertIn('false', result.data)

    def test_api_login_pass(self):
        """Test for successful login of user with correct credentials."""

        data = {'username': 'janedoe', 'password': 'password'}
        result = self.app.post('/api/login',
                               data=json.dumps(data),
                               content_type='application/json')

        self.assertIn('true', result.data)

    def test_api_login_fail(self):
        """Test for rejected login of user with incorrect credentials."""

        data = {'username': 'janedoe', 'password': 'wrongpassword'}
        result = self.app.post('/api/login',
                               data=json.dumps(data),
                               content_type='application/json')

        self.assertIn('false', result.data)

    def test_api_profile_fail(self):
        """Test for false response when user is not logged in."""

        result = self.app.post('/api/profile')

        self.assertIn('false', result.data)


################################################################################


if __name__ == '__main__':
    unittest.main()
