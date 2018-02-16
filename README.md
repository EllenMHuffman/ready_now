## About Ready Now

This is a Flask app that helps users get ready and be out the door on time. Users select activities they need to accomplish to finish being ready, and the app uses a timer to guide them through these activities. The app records users' actual times to generate predictive task completion times. If the user starts running late, the app can automatically text a specified friend with the user's updated ETA.

## Getting Started

```
$ pip install requirements.txt
$ createdb readynow
$ createdb testdb
$ python seed.py
$ python server.py
```
