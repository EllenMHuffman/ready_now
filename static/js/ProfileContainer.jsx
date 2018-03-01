'use strict';

import React from 'react';
import FriendList from './FriendList';
import DestinationList from './DestinationList';
import AvgTimesBarChart from './AvgTimesBarChart';
import ActivitySelect from './ActivitySelect';
import ActivityTimeLineChart from './ActivityTimeLineChart';


export default class ProfileContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.getAverageTimes = this.getAverageTimes.bind(this);
  }

  getAverageTimes() {
    fetch('/api/average-times', {
      method: 'POST',
      credentials: 'include'
    })
    .then((response) => response.json())
    .then((data) => this.setState({['averageTimes']: data.value}));
  }

  render() {
    // let currentView;
    // if (this.state['currentView'] === 'stats') {
    //   currentView = [];
    // }

    return (
      <div>
        <h1>Your Profile</h1>

          "user_id"
          <br />
          "first name" "last name"
          <br />
          <br />
          <AvgTimesBarChart />
          <ActivitySelect />
          <FriendList />
          <DestinationList />
      </div>
    );
  }
}
          // <ActivityTimeLineChart />
