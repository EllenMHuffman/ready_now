'use strict';

import React from 'react';
import FriendList from './FriendList';
import DestinationList from './DestinationList';


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
          <FriendList />
          <DestinationList />
      </div>
    );
  }
}
