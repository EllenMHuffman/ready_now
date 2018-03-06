'use strict';

import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

const colorPalette = {
  'blue': '#34A3BA',
  'white': '#FFF8F4',
  'dkBlue': '#217A8C',
  'black': '#000105',
  'red': '#863b87',
};

const styles = {
  header: {
    color: colorPalette.white,
    margin: 12,
  },
  form: {
    marginLeft: 30,
    marginTop: -20,
  },
  button: {
    marginTop: 8,
    marginLeft: -18,
    marginBottom: 20,
  },
  formField: {
    width: 230,
    display: 'inline-block',
  },
  genderField: {
    marginTop: 0,
    width: 230,
    position: 'relative',
    verticalAlign: 'bottom',
  },
  menuItem: {
    color: colorPalette.black,
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
    this.handleChangeGender = this.handleChangeGender.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({[name]: value});
  }

  handleChangeGender(event, index, value) {
    this.setState({['gender']: value})
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
          key={nameKey}
          style={styles.formField}
          floatingLabelText={i[1]}
          floatingLabelFixed={true}
          name={nameKey}
          type={nameKey === 'password' ? 'password' : 'text'}
          req={i[2]}
          value={this.state.nameKey}
          onChange={this.handleChange}
        />
      );
    }

    for (let c of contact) {
      let nameKey = c[0]
      contactFields.push(
        <TextField
          key={nameKey}
          style={styles.formField}
          floatingLabelText={c[1]}
          floatingLabelFixed={true}
          name={nameKey}
          type='text'
          req={c[2]}
          value={this.state.nameKey}
          onChange={this.handleChange}
        />
      );
    }

    return (
      <div>
        <h2 style={styles.header}>Register</h2>
        <form style={styles.form}>

          {infoFields}

            <SelectField id='gender-field'
              style={styles.genderField}
              floatingLabelText='Gender'
              floatingLabelFixed={true}
              value={this.state.gender}
              onChange={this.handleChangeGender}
            >
              <MenuItem style={styles.menuItem} value='decline' primaryText='--' />
              <MenuItem style={styles.menuItem} value='female' primaryText='Female' />
              <MenuItem style={styles.menuItem} value='male' primaryText='Male' />
              <MenuItem style={styles.menuItem} value='other' primaryText='Other' />
            </SelectField>

          {contactFields}
          <br />
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
