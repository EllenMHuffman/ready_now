'use strict';

import React from 'react';
import InputField from './InputField';


export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: '',
      lname: '',
      username: '',
      password: '',
      gender: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipcode: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({[name]: value});
  }

  handleSubmit(event){
    event.preventDefault();

    let data = {
      fname: this.state.fname,
      lname: this.state.lname,
      username: this.state.username,
      password: this.state.password,
      gender: this.state.gender,
      phone: this.state.phone,
      street: this.state.street,
      city: this.state.city,
      state: this.state.state,
      zipcode: this.state.zipcode
    };

    fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(data),
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) =>  {
        data.value
            ? alert('Successful registration')
            : alert('Username already exists. Please try again.');
      this.props.setLoggedIn(data.value);
      });
  }

  render() {
    let info = [
      ['fname', 'First Name: ', ''],
      ['lname', 'Last Name: ', ''],
      ['username', 'Username*: ', 'required'],
      ['password', 'Password*: ', 'required']
    ];
    let contact = [
      ['phone', 'Phone number: ', ''],
      ['street', 'Street: ', ''],
      ['city', 'City: ', ''],
      ['state', 'State abbreviation: ', ''],
      ['zipcode', 'Zipcode: ', '']
    ];

    let infoFields = [];
    let contactFields = [];

    for (let i of info) {
      infoFields.push(<InputField key={i[0]}
                                  name={i[0]}
                                  display={i[1]}
                                  req={i[2]}
                                  handleChange={this.handleChange}
                                  state={this.state} />);
    }

    for (let c of contact) {
      contactFields.push(<InputField key={c[0]}
                                     name={c[0]}
                                     display={c[1]}
                                     req={c[2]}
                                     handleChange={this.handleChange}
                                     state={this.state} />);
    }

    return (
      <div>
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>

          {infoFields}
          <label>
            Gender:
            <select name='gender'
                    value={this.state.value}
                    onChange={this.handleChange}>
              <option value='decline'> - </option>
              <option value='female'> Female </option>
              <option value='male'> Male </option>
              <option value='other'> Other </option>
            </select>
          </label>
          <br />
          {contactFields}

          <input type='submit' value='Register' />
        </form>
      </div>
    );
  }
}
