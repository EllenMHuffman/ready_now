'use strict';

import React from 'react';
import SelectOption from './SelectOption';


export default class FriendSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.fetchFriends = this.fetchFriends.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({[name]: value});
  }

  handleSubmit(event){
    event.preventDefault();

    let data = {
      phone: this.state.phone,
      message: this.state.message
    };

    fetch('/api/text-friend', {
      method: 'POST',
      body: JSON.stringify(data),
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        data.value
            ? alert('Message sent!')
            : alert('Error. Please try again.')
      });
    this.setState({['value']: ''});
  }

  render() {
    let friends = [];
    for (let friend_id in this.state.data) {
      friends.push(<SelectOption key={this.state.data[friend_id]['phone']}
                                 value={this.state.data[friend_id]['phone']}
                                 displayText={this.state.data[friend_id]['name']} />);
    }

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
            <h3>Message a friend</h3>
            <label>
              Choose friend:
              <br />
              <select name='phone'
                      value={this.state.value}
                      onChange={this.handleChange}>
                <option value='null'> -- </option>
                {friends}
              </select>
            </label>
            <br />
            <label>
              Write your message:
              <br />
              <textarea name='message'
                        value={this.state.value}
                        onChange={this.handleChange} />
            </label>
            <br />
            <input type='submit' value='Send text' />
        </form>
      </div>
    );
  }
}
