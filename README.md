## About Ready Now

This Flask-React SPA helps users anticipate how long it will take to get ready and keeps them on track to complete each step. Users select activities, the JavaScript front end determines how long those steps will take, and timers track each step. When logged in, the app learns about the user by recording actual times for each step in the PostgreSQL database, and later queries that information with SQLAlchemy to provide better time estimates. If the user falls behind the initial projected completion time, the app can automatically text an updated ETA to the user's friend through the Twilio API. Users can also view their profile page that features D3 data visualizations of the different steps and completion times.

## Getting Started

```
$ pip install requirements.txt
$ createdb readynow
$ createdb testdb
$ python seed.py
$ python server.py
```
