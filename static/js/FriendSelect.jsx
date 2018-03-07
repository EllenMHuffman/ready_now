'use strict';

import React from 'react';

import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import Snackbar from 'material-ui/Snackbar'
import TextField from 'material-ui/TextField';

import SelectOption from './SelectOption';

const colorPalette = {
  blue: '#34A3BA',
  white: '#FFF8F4',
  dkBlue: '#217A8C',
  black: '#000105',
  ltBlue: '#C3ECF4',
};

const styles = {
  button: {
    borderRadius: 16,
    margin: 12,
    position: 'relative',
    top: 24,
  },
  buttonStyle: {
    borderRadius: 16,
  },
  form: {
    height: 250,
    marginLeft: 30,
    marginTop: -20,
  },
  phoneField: {
    display: 'inline-block',
    width: 250,
    margin: 10,
    marginBottom: 0,
    verticalAlign: 'bottom',
  },
  formField: {
    display: 'inline-block',
    width: 250,
    margin: 10,
    marginBottom: 0,
  },
  menuItem: {
    color: colorPalette.black,
  },
  formColor: {
    color: colorPalette.white,
    borderColor: colorPalette.white,
  },
  underlineFocus: {
    borderColor: colorPalette.dkBlue,
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
        style={styles.menuItem}
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
              <h3 style={{margin: 12}}>Message a friend</h3>
              <label>
                <SelectField
                  style={styles.phoneField}
                  floatingLabelText='Choose one or more friends'
                  floatingLabelFixed={true}
                  floatingLabelStyle={styles.formColor}
                  floatingLabelFocusStyle={styles.formColor}
                  underlineStyle={styles.formColor}
                  underlineFocusStyle={styles.underlineFocus}
                  multiple={true}
                  maxHeight={200}
                  value={this.state.phones}
                  onChange={this.handleChangePhone}
                >
                  {this.menuItems()}
                </SelectField>
              </label>
              <label className='friend-select' id='message'>
                <TextField
                  style={styles.formField}
                  hintText="message"
                  floatingLabelText="Write your message:"
                  floatingLabelFixed={true}
                  floatingLabelStyle={styles.formColor}
                  floatingLabelFocusStyle={styles.formColor}
                  underlineStyle={styles.formColor}
                  underlineFocusStyle={styles.underlineFocus}
                  multiLine={true}
                  rows={1}
                  value={this.state.message}
                  onChange={this.handleChangeMessage}
                />
              </label>
              <label className='friend-select'>
                <RaisedButton
                  type='submit'
                  label='Send text'
                  primary={true}
                  style={styles.button}
                  buttonStyle={styles.buttonStyle}
                  overlayStyle={styles.buttonStyle} />
              </label>
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
