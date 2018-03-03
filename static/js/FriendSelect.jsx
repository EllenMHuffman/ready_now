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
      values: [],
      friendInfo: []
    };
    this.fetchFriends = this.fetchFriends.bind(this);
    this.handleChange = this.handleChange.bind(this);
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

  handleChange(event, index, values) {
    // const value = event.target.value;
    // const name = event.target.name;
    // this.setState({[name]: values});
    // debugger;
    this.setState({values});
    // console.log((this.state));
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
        checked={this.state.values.indexOf(friend.phone) > -1}
        value={friend.phone}
        primaryText={friend.name}
      />
    ));
  }

  // menuItems(values) {
  //   // let friends = Object.entries(this.state.data)
  //   // return friends.map((friend) => (
  //   //   <MenuItem
  //   //     key={friend.key}
  //   //     insetChildren={true}
  //   //     checked={values && values.indexOf(friend.key) > -1}
  //   //     value={friend.value['phone']}
  //   //     primaryText={friend.value['name']}
  //   //   />
  //   // ));
  // }

  render() {
    const {values} = this.state;
    const {data} = this.state;
    // console.log(data);
    // console.log(this.state.values);
    // console.log(this.state.data);
    // console.log(values);
    console.log(this.state);
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
            <h3>Message a friend</h3>
            <label>
              <SelectField
                multiple={true}
                hintText='Choose one or more friends'
                name='phone'
                value={values}
                onChange={this.handleChange}
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
                        onChange={this.handleChange} />
            </label>
            <br />
            <input type='submit' value='Send text' />
        </form>
      </div>
    );
  }
}
