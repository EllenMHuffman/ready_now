'use strict';

import React from 'react';


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
      friends.push(<li>{this.state.data[friendId]['name']}</li>);
    }    return (
      <div>
        <h3>Saved Friends</h3>
        <ul>
          {friends}
        </ul>
      </div>

    );
  }
}
