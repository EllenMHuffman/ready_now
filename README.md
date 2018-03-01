## About Ready Now

This React app anticipates how long it takes users to get ready via client-side timers. When logged in, a Flask server captures timestamps in a PostgreSQL database and later aggregates timing records with SQLAlchemy to provide personalized timer estimates. If the user falls behind their initial estimate, the app can text an update to their friend with Twilio. The user’s profile page features React-Vis data visualizations of their different steps and completion times.

## Getting Started

```
$ pip install requirements.txt
$ createdb readynow
$ createdb testdb
$ python seed.py
$ python server.py
```
