'use strict';

import React from 'react';
import FriendAdd from './FriendAdd';
import DestinationAdd from './DestinationAdd';
import UpdateUserInfo from './UpdateUserInfo';


export default class SettingsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'currentView': 'info'
    };
    this.addFriend = this.addFriend.bind(this);
    this.addDestination = this.addDestination.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
  }

  addFriend(event) {
    this.setState({['currentView']: 'friend'});
  }

  addDestination(event) {
    this.setState({['currentView']: 'destination'});
  }

  updateInfo(event) {
    this.setState({['currentView']: 'info'});
  }

  render() {
    let buttons = [];
    let currentView;

    if (this.state['currentView'] === 'friend') {
      buttons.push(<button key='destination'
                        onClick={this.addDestination}>Add Destination</button>);
      buttons.push(<button key='info'
                        onClick={this.updateInfo}>Update Your Info</button>);
      currentView = [<FriendAdd updateInfo={this.updateInfo}/>];

    } else if (this.state['currentView'] === 'destination') {
      buttons.push(<button key='friend'
                        onClick={this.addFriend}>Add Friend Info</button>);
      buttons.push(<button key='info'
                        onClick={this.updateInfo}>Update Your Info</button>);
      currentView = [<DestinationAdd />];

    } else if (this.state['currentView'] === 'info') {
      buttons.push(<button key='friend'
                        onClick={this.addFriend}>Add Friend Info</button>);
      buttons.push(<button key='destination'
                        onClick={this.addDestination}>Add Destination</button>);
      currentView = [<UpdateUserInfo />];
    }

    return (
      <div>
        <h1>Settings</h1>

          <br />
          {buttons}
          <br />
          {currentView}
      </div>
    );
  }
}
