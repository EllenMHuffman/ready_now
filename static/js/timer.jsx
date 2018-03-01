'use strict';

import React from 'react';
import moment from 'moment';


export default class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      time: {},
      seconds: this.props.time,
      active: true,
      startTime: null,
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
      let timeNow = moment();
      this.timer = setInterval(this.countDown, 1000);
      this.setState({startTime: timeNow,
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
    let timeNow = moment();
    this.setState({
      active: false,
      // endTime: timeNow.unix()
    });
    let data = {
      startTime: this.state.startTime.unix(),
      endTime: timeNow.unix(),
      actId: this.props.actId};
    this.sendData(data);
    this.props.calculateProjectedETA(data);
  }

  render() {
    return (
      <div>
        <div> {this.props.name}:</div>
        <span>{this.state.time.m}:{this.state.time.s} ....</span>
        <div>
          <button onClick={this.startTimer}>Start</button>
          <button onClick={this.stopTimer}>Stop</button>
        </div>
      </div>
    );
  }
}

// https://stackoverflow.com/questions/40885923/countdown-timer-in-react
// Fabian Schultz
