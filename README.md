## About Ready Now

This single page time management app in React has a backend in Flask and PostgreSQL. Ready Now gets smarter with each use by capturing timestamps with JavaScript timers, sending the data to the server via AJAX fetch requests, and adds new records to the database with SQLAlchemy. That information is aggregated and queried to provide personalized timer estimates for the user.

As the user goes through each step, the projected ETA is recalculated and changes color to reflect any changes to the time. All calculations and color changes are done with conditional logic in JavaScript. Integration of the Twilio API allows the user to directly text a friend as they're using the timers.

The user’s profile page features React-Vis data visualizations of their different activities and completion times.

#### Tech stack:
Python2, PostgreSQL, Flask, JavaScript, React.js, React-Vis

---
## Screencast
<a href="http://www.youtube.com/watch?feature=player_embedded&v=o4lqMjGg-eY" target="_blank"><img src="http://img.youtube.com/vi/o4lqMjGg-eY/0.jpg"
alt="View screencast demo" width="240" height="180" border="10" /></a>

|Images | |
|--- | --- |
| ![alt text][pic0] | ![alt text][pic1] |
| ![alt text][pic2] | ![alt text][pic3] |
| ![alt text][pic4] | ![alt text][pic5] |
| ![alt text][pic6] | ![alt text][pic7] |
| ![alt text][pic8] | ![alt text][pic9] |

[pic0]: https://i.imgur.com/qV5odh9.png "Default times on landing page"
[pic1]: https://i.imgur.com/nrXG55b.png "User registration or login"
[pic2]: https://i.imgur.com/761KClP.png "Personalized times for logged in users"
[pic3]: https://i.imgur.com/ybYG6Kg.png "Timers log actual completion times"
[pic4]: https://i.imgur.com/FyVyOVm.png "Projected ETA recalculates after each timer"
[pic5]: https://i.imgur.com/Mg2Ud9m.png "Select one or more friends"
[pic6]: https://i.imgur.com/Wz9S3gG.png "Write custom message"
[pic7]: https://i.imgur.com/JUSkX5F.png "Send text via Twilio API"
[pic8]: https://i.imgur.com/irhI70q.png "Select activities to display and display"
[pic9]: https://i.imgur.com/JWbvSun.png "Linechart updates for selected activities"

---
## Getting Started
After cloning this repo and creating a virtual environment, follow these steps:

```
$ npm install
$ pip install -r requirements.txt
$ createdb readynow
$ python seed.py
$ npm build-dev
$ npm start
```