'use strict';

class TimersContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {'friends': null}
  }

  calculateETA() {
    let timeNow = moment();
    let totalTime = 0;
    for (let act_id in this.props.data) {
      totalTime += this.props.data[act_id]['time'];
    }
    return timeNow.add(totalTime, 's');
  }

  render() {
    let totalTime = this.calculateETA();
    let activities = [];
    for (let act_id in this.props.data) {
      if (this.props.data[act_id]['clicked'] === true) {
      activities.push(<Activity key={act_id}
                                act_id={act_id}
                                name={this.props.data[act_id]['name']}
                                time={this.props.data[act_id]['time']} />);
      }
    }
    let friendList = <FriendSelect />
    return (
      <div>
        <h2>Click 'Start' and 'Stop' for each step</h2>
        {activities}
        <br />
        <br />
        <div>Initial ETA: {totalTime.format('h:mm a')}</div>
        {friendList}
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
    this.state = { visible: true,
                   time: {},
                   seconds: this.props.time,
                   active: true,
                   start_t: null,
                   end_t: null
                 };
    this.timer = 0;
    this.toggleVisible = this.toggleVisible.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.sendData = this.sendData.bind(this);
  }

  toggleVisible() {
    let newVisible = this.state.visible == false ? true : false;
    this.setState({ visible: newVisible });
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
      this.setState({start_t: timeNow,
                     visible: false});
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

  sendData(data) {
    fetch('/api/add-record', {
      body: JSON.stringify(data),
      method: 'post',
      credentials: 'include'
    });
  }

  stopTimer() {
    let timeNow = Math.floor(Date.now());
    this.setState({
      active: false,
      end_t: timeNow
    });
    let data = {
      start_t: this.state.start_t,
      end_t: timeNow,
      act_id: this.props.act_id};
    console.log(data);
    this.sendData(data);
  }

  render() {
    return (
      <div>
        {this.state.time.m}:{this.state.time.s} ....
        <button onClick={this.startTimer}>Start</button>
        <button onClick={this.stopTimer}>Stop</button>
      </div>
    );
  }
}

// https://stackoverflow.com/questions/40885923/countdown-timer-in-react
// Fabian Schultz

class FriendSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.fetchFriends = this.fetchFriends.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchFriends();
  }

  fetchFriends() {
    fetch('/api/get-friends', {
      method: 'post',
      credentials: 'include'
    })
    .then((response) => response.json())
    .then((data) => this.setState({data}));
  }

  handleChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({[name]: value});
  }

  handleSubmit(event){
    event.preventDefault();

    let data = {
      phone: this.state.phone,
      message: this.state.message
    };

    fetch('/api/text-friend', {
      method: 'POST',
      body: JSON.stringify(data),
      credentials: 'include'
    })
      // .then((response)=> response.json())
      // .then((data)=>  this.props.setLoggedIn(data.value));
  }

  render() {
    let friends = [];
    for (let friend_id in this.state.data) {
      friends.push(<FriendOption key={this.state.data[friend_id]['phone']}
                                 phone={this.state.data[friend_id]['phone']}
                                 name={this.state.data[friend_id]['name']} />);
    }
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
            <h3>Message a friend</h3>
            <label>
              Choose friend:
              <br />
              <select name='phone'
                      value={this.state.value}
                      onChange={this.handleChange}>
                <option value='null'> -- </option>
                {friends}
              </select>
            </label>
            <br />
            <label>
              Write your message:
              <br />
              <textarea name='message'
                        value={this.state.value}
                        onChange={this.handleChange} />
            </label>
            <br />
            <input type='submit' value='Send text' />
        </form>
      </div>
    );
  }
}

class FriendOption extends React.Component {
  render() {
    return (
      <option value={this.props.phone}>{this.props.name}</option>
    );
  }
}
