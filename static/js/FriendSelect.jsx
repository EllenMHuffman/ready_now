'use strict';

import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar'

import SelectOption from './SelectOption';


const style = {
  margin: 12
};

export default class FriendSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friendInfo: [],
      phones: [],
      message: '',
      open: false,
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

  handleChangeMessage(event, values) {
    this.setState({['message']: values});
  }

  handleSubmit(event){
    // ADD THE SNACKBAR HANDLE CLICK FUNCTION TO THIS FUNCTION; NEED TO
    // IMPLEMENT THE HANDLEACTION FUNCTIONS AS WELL
    event.preventDefault();

    let data = {
      phones: this.state.phones,
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
    this.setState({['phones']: '', ['message']: ''});
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
              <br />
              <TextField
                hintText="message"
                floatingLabelText="Write your message:"
                multiLine={true}
                rows={2}
                value={this.state.message}
                onChange={this.handleChangeMessage}
              />
            </label>
            <br />
            <RaisedButton type='submit' label='Send text' style={style} />
        </form>
        <Snackbar
          open={this.state.open}
          message="Message sent!"
          autoHideDuration={this.state.autoHideDuration}
          onActionClick={this.handleActionClick}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    );
  }
}
