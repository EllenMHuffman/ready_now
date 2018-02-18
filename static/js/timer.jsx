'use strict';

class TimersContainer extends React.Component {

  startActivities() {
    alert('Working!!');
  }

  stopActivities() {
    alert('stahhhhhp');
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
      activities.push(<Activity key={activity}
                                act_id={activity}
                                name={current_activity[0]}
                                time={current_activity[1]} />);
    }
    return (
      <div>
      <button onClick={this.startActivities}>Begin N/A </button>
      {activities}
      <br />
      <button onClick={this.stopActivities}>Finish N/A </button>
      <br />
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
        <span> <Timer time={this.props.time}
                      act_id={this.props.act_id}/> </span>
      </div>
    );
  }
}

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { display: false,
                   time: {},
                   seconds: this.props.time,
                   active: true,
                   start_t: null,
                   end_t: null
                 };
    this.timer = 0;
    this.toggleDisplay = this.toggleDisplay.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.sendData = this.sendData.bind(this);
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
      let timeNow = Math.floor(Date.now());
      this.timer = setInterval(this.countDown, 1000);
      this.setState({start_t: timeNow});
    }
  }

  countDown() {
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });

    if (this.state.active == false) {
      clearInterval(this.timer);
    }
  }

  stopTimer() {
    let timeNow = Math.floor(Date.now());
    this.setState({ active: false,
                    end_t: timeNow
                  });
  }

  sendData() {
    setTimeout( ()=> {
      let data = {start_t: this.state.start_t,
             end_t: this.state.end_t,
             act_id: this.props.act_id};
      fetch('/add-record', {body: JSON.stringify(data),
                            method: 'post',
                            credentials: 'include'});
    }, 2000);
  }

  nextActivity() {
    alert('Go to next activity')
  }

  render() {
    return (
      <div>
        {this.state.time.m}:{this.state.time.s} ....
        <button onClick={this.startTimer}>Start</button>
        <button onClick={()=>(this.stopTimer(), this.sendData())}>Stop</button>
      </div>
    );
  }
}

// https://stackoverflow.com/questions/40885923/countdown-timer-in-react
// Fabian Schultz


