'use strict';

import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import SelectOption from './SelectOption';


const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

export default class FriendSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friendInfo: [],
      phones: [],
      message: '',
    };
    this.fetchFriends = this.fetchFriends.bind(this);
    this.handleChangePhone = this.handleChangePhone.bind(this);
    this.handleChangeMessage = this.handleChangeMessage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.menuItems = this.menuItems.bind(this);
    this.fetchFriends();
  }

  fetchFriends() {
    fetch('/api/get-friends', {
      method: 'post',
      credentials: 'include'
    })
    .then((response) => response.json())
    .then((data) => this.setState({['friendInfo']: data}));
  }

  handleChangePhone(event, index, values) {
    this.setState({['phones']: values});
  }

  handleChangeMessage(event) {
    const value = event.target.value;
    this.setState({['message']: value});
  }

  handleSubmit(event){
    event.preventDefault();

    let data = {
      phone: this.state.phone,
      message: this.state.message
    };

    // fetch('/api/text-friend', {
    //   method: 'POST',
    //   body: JSON.stringify(data),
    //   credentials: 'include'
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     data.value
    //         ? alert('Message sent!')
    //         : alert('Error. Please try again.')
    //   });
    // this.setState({['value']: ''});
  }

  menuItems() {
    return this.state.friendInfo.map((friend) => (
      <MenuItem
        key={friend.id}
        insetChildren={true}
        checked={this.state.phones.indexOf(friend.phone) > -1}
        value={friend.phone}
        primaryText={friend.name}
      />
    ));
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
            <h3>Message a friend</h3>
            <label>
              <SelectField
                multiple={true}
                hintText='Choose one or more friends'
                value={this.state.phones}
                onChange={this.handleChangePhone}
              >
                {this.menuItems()}
              </SelectField>
            </label>
            <br />
            <label>
              Write your message:
              <br />
              <textarea name='message'
                        value={this.state.value}
                        onChange={this.handleChangeMessage} />
            </label>
            <br />
            <input type='submit' value='Send text' />
        </form>
      </div>
    );
  }
}
