'use strict';

import React from 'react';
import moment from 'moment';

import RaisedButton from 'material-ui/RaisedButton';
import {TableRow, TableRowColumn} from 'material-ui/Table';
import Chip from 'material-ui/Chip';

const colorPalette = {
  blue: '#34A3BA',
  white: '#FFF8F4',
  dkBlue: '#217A8C',
  black: '#000105',
  ltBlue: '#C3ECF4',
};

const timerColors = {
  dkRed: '#AD1414',
  ltRed: '#cc3232',
  orange: '#db7b2b',
  yellow: "#e7b416",
  ltGreen: '#99c140',
  dkGreen: '#2dc937',
};

const styles = {
  chip: {
    margin: 2,
    color: colorPalette.black,
    fontSize: 14
  },
  wrapper: {
    display: 'flex',
    flexwrap: 'wrap',
  },
  button: {
    margin: 6,
    borderRadius: 16,
  },
  buttonStyle: {
    borderRadius: 16,
  },
  text: {
    color: colorPalette.white,
    fontSize: 20,
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
      chipColor: colorPalette.ltBlue,
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
      nextState['chipColor'] = timerColors.ltGreen;
    } else if ((seconds / this.props.time) > 0.3) {
      nextState['chipColor'] = timerColors.yellow;
    } else if ((seconds / this.props.time) > 0) {
      nextState['chipColor'] = timerColors.orange;
    } else if ((seconds / this.props.time) < -0.1) {
      nextState['chipColor'] = timerColors.ltRed;
    } else if ((seconds / this.props.time) <= 0) {
      nextState['chipColor'] = timerColors.dkRed;
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
      index: this.props.actId};
    this.sendData(data);
    this.props.calculateProjectedETA(data);
  }

  render() {
    let button;
    switch (this.state.status) {
      case 'idle':
        button = <RaisedButton
                    label="Start"
                    primary={true}
                    style={styles.button}
                    buttonStyle={styles.buttonStyle}
                    overlayStyle={styles.buttonStyle}
                    onClick={this.startTimer} />;
        break;
      case 'pending':
        button = <RaisedButton
                    label="Stop"
                    primary={true}
                    style={styles.button}
                    buttonStyle={styles.buttonStyle}
                    overlayStyle={styles.buttonStyle}
                    onClick={this.stopTimer} />;
        break;
      case 'completed':
        button = null;
    }

    let time = this.formatTime(this.state.seconds);

    return (
      <TableRow>
        <TableRowColumn style={{paddingLeft: 40}}>
          <span style={styles.text}>
            {this.props.name}
          </span>
        </TableRowColumn>
        <TableRowColumn style={{paddingLeft: 112}}>
          <Chip
            style={styles.chip}
            backgroundColor={this.state.chipColor}
          >
            <span style={styles.chip}>{time[0]}:{time[1]}</span>
          </Chip>
        </TableRowColumn>
        <TableRowColumn style={{textAlign: 'right', paddingRight: 34}}>{button}</TableRowColumn>
      </TableRow>
    );
  }
}
