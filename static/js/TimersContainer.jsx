'use strict';

import React from 'react';
import moment from 'moment';
import Timer from './Timer';
import FriendSelect from './FriendSelect';


export default class TimersContainer extends React.Component {
  constructor(props) {
    super(props);
    this.calculateETA = this.calculateETA.bind(this);
    this.calculateProjectedETA = this.calculateProjectedETA.bind(this);
    let eta = this.calculateETA();
    this.state = {
      'friends': null,
      'initialETA': eta,
      'projectedETA': eta
    };
  }

  calculateETA() {
    let timeNow = moment();
    let totalTime = 0;
    for (let actId in this.props.timerData) {
      totalTime += this.props.timerData[actId]['time'];
    }
    return timeNow.add(totalTime, 's');
  }

  calculateProjectedETA(data) {
    let actualTime = data.endTime - data.startTime;
    let difference = (this.props.timerData[data.actId]['time'] - actualTime);
    let newETA = moment(this.state['projectedETA'] - difference * 1000);
    this.setState({['projectedETA']: newETA});
  }

  render() {
    let initialTime = this.state['initialETA'];
    let projectedTime = this.state['projectedETA'];
    let activities = [];

    for (let actId in this.props.timerData) {
      activities.push(<Timer key={actId}
                             actId={actId}
                             name={this.props.timerData[actId]['name']}
                             time={this.props.timerData[actId]['time']}
                             calculateProjectedETA={this.calculateProjectedETA} />);
    }
    let messageFriend = <FriendSelect />
    return (
      <div>
        <h2>Click 'Start' and 'Stop' for each step</h2>
        {activities}
        <br />
        <br />
        <div>Initial ETA: {initialTime.format('h:mm a')}</div>
        <div>Projected ETA: {projectedTime.format('h:mm a')}</div>
        {messageFriend}
      </div>
    );
  }
}
