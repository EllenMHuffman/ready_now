'use strict';

import React from 'react';


export default class FriendAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      phone: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({[name]: value});
  }

  handleSubmit(event) {
    event.preventDefault();

    let data = {
      name: this.state.name,
      phone: this.state.phone
    };

    fetch('/api/add-friend', {
      method: 'POST',
      body: JSON.stringify(data),
      credentials: 'include'
    })
      .then((response)=> response.json())
      .then((data)=> {
        data.value
            ? alert('Successfully added friend contact info')
            : alert('Update unsuccessful. Please try again.');
      })
      .then(this.props.updateInfo);
  }

  render() {
    return (
      <div>
        <h2>Enter your friends contact information</h2>
        <form onSubmit={this.handleSubmit}>
          <label>
            Friend Name:
            <input
              name='name'
              type='text'
              value={this.state.name}
              onChange={this.handleChange} required />
          </label>
          <br />
          <label>
            Phone Number:
            <input
              name='phone'
              type='text'
              value={this.state.phone}
              onChange={this.handleChange} required />
          </label>
          <br />
          <input type='submit' value='Submit' />
        </form>
      </div>
    );
  }
}
