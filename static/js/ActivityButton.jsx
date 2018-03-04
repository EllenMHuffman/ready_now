'use strict';

import moment from 'moment';
import React from 'react';


export default class ActivityButton extends React.Component {
  render() {
    let time = moment.duration(this.props.time, 'seconds');
    let minutes = time.minutes();
    let seconds = time.seconds() % 60;
    seconds = ("0" + seconds).slice(-2)

    return (
      <div>
        <button value={this.props.actId} onClick={this.props.handleClick}>
          {this.props.name}-- {minutes}:{seconds} minutes</button>
      </div>
    );
  }
}
