'use strict';

import React from 'react';
import moment from 'moment';

import {TableRow, TableRowColumn} from 'material-ui/Table';
import Chip from 'material-ui/Chip';
import {
  grey300,
  lightGreen500,
  yellow500,
  orange500,
  red500,
  red900
} from 'material-ui/styles/colors';

const styles = {
  chip: {
    margin: 2,
  },
  wrapper: {
    display: 'flex',
    flexwrap: 'wrap',
  },
};


export default class Timer extends React.Component {
  statics: {muiName: 'TableRow'};
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      time: {},
      seconds: this.props.time,
      status: 'idle',
      startTime: null,
      chipColor: grey300,
    };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.formatTime = this.formatTime.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.sendData = this.sendData.bind(this);
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
    this.setState({time: timeLeftVar});
  }

  startTimer() {
    if (this.timer == 0) {
      let timeNow = moment();
      this.timer = setInterval(this.countDown, 1000);
      this.setState({startTime: timeNow,
                     status: 'pending'});
    }
  }

  countDown() {
    let seconds = this.state.seconds - 1;
    let nextState = this.state;

    if ((seconds / this.props.time) > 0.6) {
      nextState['chipColor'] = lightGreen500;
    } else if ((seconds / this.props.time) > 0.3) {
      nextState['chipColor'] = yellow500;
    } else if ((seconds / this.props.time) > 0) {
      nextState['chipColor'] = orange500;
    } else if ((seconds / this.props.time) < -0.1) {
      nextState['chipColor'] = red900;
    } else if ((seconds / this.props.time) <= 0) {
      nextState['chipColor'] = red500;
    }
    nextState['time'] = this.secondsToTime(seconds);
    nextState['seconds'] = seconds;
    this.setState({nextState});

    if (this.state.status == 'completed') {
      clearInterval(this.timer);
    }
  }

  formatTime(seconds) {
    let formattedSeconds, formattedMinutes;
    let secs = this.state.time.s;

    if (seconds >= 0) {
      formattedSeconds = ("0" + secs).slice(-2);
      formattedMinutes = this.state.time.m;
    } else {
      formattedMinutes = Math.ceil(this.state.time.m + .1);
      formattedSeconds = (("0" + Math.abs(secs)).slice(-2) + '  OVERTIME');
    }

    return [formattedMinutes, formattedSeconds]
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
      status: 'completed',
    });
    let data = {
      startTime: this.state.startTime.unix(),
      endTime: timeNow.unix(),
      actId: this.props.actId};
    this.sendData(data);
    this.props.calculateProjectedETA(data);
  }

  render() {
    let button;
    switch (this.state.status) {
      case 'idle':
        button = <button onClick={this.startTimer}>Start</button>;
        break;
      case 'pending':
        button = <button onClick={this.stopTimer}>Stop</button>;
        break;
      case 'completed':
        button = null;
    }

    let time = this.formatTime(this.state.seconds);

    return (
      <TableRow>
        <TableRowColumn>{this.props.name}</TableRowColumn>
        <TableRowColumn>
          <Chip
            style={styles.chip}
            backgroundColor={this.state.chipColor}
          >
            {time[0]}:{time[1]}
          </Chip>
        </TableRowColumn>
        <TableRowColumn>{button}</TableRowColumn>
      </TableRow>
    );
  }
}
