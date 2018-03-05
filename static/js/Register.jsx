'use strict';

import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';


const styles = {
  form: {
    margin: 20,
  },
  button: {
    margin: 12,
  },
  customWidth: {
    width: 150,
  },
};


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
      let nameKey = i[0];
      infoFields.push(
        <TextField
          floatingLabelText={i[1]}
          name={nameKey}
          type={nameKey === 'password' ? 'password' : 'text'}
          req={i[2]}
          value={this.state.nameKey}
          onChange={this.handleChange}
        />
      );
    }
    // infoFields.push(<br />);

    for (let c of contact) {
      let nameKey = c[0]
      contactFields.push(
        <TextField
          floatingLabelText={c[1]}
          name={nameKey}
          type='text'
          req={c[2]}
          value={this.state.nameKey}
          onChange={this.handleChange}
        />
      );
    }
    // contactFields.push(<br />);

    return (
      <div>
        <h1>Register</h1>
        <form style={styles.form}>

          {infoFields}
          <label>
            <SelectField
              style={styles.customWidth}
              floatingLabelText='Gender'
              name='gender'
              value={this.state.value}
              onChange={this.handleChange}
            >
              <MenuItem value='decline' primaryText='--' />
              <MenuItem value='female' primaryText='Female' />
              <MenuItem value='male' primaryText='Male' />
              <MenuItem value='other' primaryText='Other' />
            </SelectField>
          </label>
          <br />
          {contactFields}

          <RaisedButton
            primary={true}
            label='Register'
            style={styles.button}
            onClick={this.handleSubmit}
          />
        </form>
        <Divider />
      </div>
    );
  }
}
