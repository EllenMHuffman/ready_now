'use strict';

import React from 'react';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';



export default class FriendList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.fetchFriends = this.fetchFriends.bind(this);
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

  render() {
    let friends = [];
    for (let friendId in this.state.data) {
      friends.push(
        <ListItem
          primaryText={this.state.data[friendId]['name']}
          style={{padding: 4}}
        />);
    }
    return (
      <div>
        <h3>Saved Friends</h3>
        <Divider />
        <List>
          {friends}
        </List>
      </div>
    );
  }
}
