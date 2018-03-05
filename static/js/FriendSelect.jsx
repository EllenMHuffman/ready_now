'use strict';

import React from 'react';

import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import Snackbar from 'material-ui/Snackbar'
import TextField from 'material-ui/TextField';

import SelectOption from './SelectOption';


const styles = {
  button: {
    margin: 12,
    position: 'relative',
    top: -32,
  },
  form: {
    height: 250,
  },
};

export default class FriendSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friendInfo: [],
      phones: [],
      message: '',
      open: false,
      autoHideDuration: 4000,
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

  handleSubmit(event) {
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
            ? this.setState({
                ['phones']: '',
                ['message']: '',
                ['open']: true,
              })
            : alert('Error. Please try again.')
      });

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
    let textingAbility;
    switch (this.state.friendInfo.length) {
      case 0:
        textingAbility = (<p>If you'd like the ability to text your ETA to a
          friend, please add their contact information under Settings.</p>);
        break;
      default:
        textingAbility = (
          <div>
            <form onSubmit={this.handleSubmit} style={styles.form}>
              <h3>Message a friend</h3>
              <label className='friend-select'>
                <SelectField
                  multiple={true}
                  maxHeight={200}
                  hintText='Choose one or more friends'
                  value={this.state.phones}
                  onChange={this.handleChangePhone}
                >
                  {this.menuItems()}
                </SelectField>
              </label>
              <label className='friend-select' id='message'>
                <TextField
                  hintText="message"
                  floatingLabelText="Write your message:"
                  multiLine={true}
                  rows={1}
                  value={this.state.message}
                  onChange={this.handleChangeMessage}
                />
              </label>
              <label className='friend-select'><RaisedButton type='submit' label='Send text' style={styles.button} /></label>
            </form>
            <Snackbar
              open={this.state.open}
              message='Text sent!'
              autoHideDuration={this.state.autoHideDuration}
            />
          </div>
        );
    }
    return (
      <div>
        {textingAbility}
      </div>
    );
  }
}
