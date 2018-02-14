'use strict';

class ActivitiesContainer extends React.Component {
  startActivities() {
    alert('Working!!');
  }

  stopActivities() {
    alert('stahhhhhp')
  }

  calculateETA() {
    let timeNow = moment();
    let totalTime = 0;
    for (let activity in this.props.data) {
      totalTime += this.props.data[activity][1];
    }
    return timeNow.add(totalTime, 's');
  }

  render() {
    let totalTime = this.calculateETA();
    let activities = [];
    for (let activity in this.props.data) {
      let current_activity = this.props.data[activity];
      activities.push(<Activity id={activity}
                                name={current_activity[0]}
                                time={current_activity[1]} />);
    }
    return (
      <div>
      <button onClick={this.startActivities} type='button'>Start</button>
      {activities}
      <br />
      <button onClick={this.stopActivities} type='button'>Stop</button>
      <div>Initial ETA: {totalTime.format('h:mm a')}</div>
      </div>
    );
  }
}

class Activity extends React.Component {
  render() {
    return (
      <div>
        <span> {this.props.name}:</span>
        <span> <Timer time={this.props.time} /> </span>
      </div>
    );
  }
}

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { display: false, time: {}, seconds: this.props.time};
    this.timer = 0;
    this.toggleDisplay = this.toggleDisplay.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  toggleDisplay() {
    let newDisplay = this.state.display == false ? true : false;
    this.setState({ display: newDisplay });
  }

  secondsToTime(secs) {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      'h': hours,
      'm': minutes,
      's': seconds
    };
    return obj;
  }

  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
  }

  startTimer() {
    if (this.timer == 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });

    if (seconds == 0) {
      clearInterval(this.timer);
    }
  }

  render() {
    return (
      <div>
        m: {this.state.time.m} s: {this.state.time.s}
        <button onClick={this.startTimer}>Next</button>
      </div>
    );
  }
}

// https://stackoverflow.com/questions/40885923/countdown-timer-in-react
// Fabian Schultz




