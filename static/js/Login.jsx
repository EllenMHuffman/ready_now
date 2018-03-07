'use strict';

import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

const colorPalette = {
  blue: '#34A3BA',
  white: '#FFF8F4',
  dkBlue: '#217A8C',
  black: '#000105',
  ltBlue: '#C3ECF4',
};

const styles = {
  form: {
    marginLeft: 30,
    marginTop: -18,
  },
  button: {
    marginTop: 8,
    marginLeft: -18,
    marginBottom: 20,
  },
  formColor: {
    color: colorPalette.white,
    borderColor: colorPalette.white,
  },
  underlineFocus: {
    borderColor: colorPalette.dkBlue,
  },
};


export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {username: '',
                  password: ''};
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
      username: this.state.username,
      password: this.state.password
    };

    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(data),
      credentials: 'include'
    })
      .then((response)=> response.json())
      .then((data)=>  this.props.setLoggedIn(data.value));
  }

  render() {
    return(
      <div>
        <h2 style={{margin: 12}}>Log In</h2>
        <form style={styles.form}>
          <label>
            <TextField
              floatingLabelText='Username'
              floatingLabelFixed={true}
              floatingLabelStyle={styles.formColor}
              floatingLabelFocusStyle={styles.formColor}
              underlineStyle={styles.formColor}
              underlineFocusStyle={styles.underlineFocus}
              name='username'
              type='text'
              value={this.state.username}
              onChange={this.handleChange} required
            />
          </label>
          <br />
          <label>
            <TextField
              floatingLabelText='Password'
              floatingLabelFixed={true}
              floatingLabelStyle={styles.formColor}
              floatingLabelFocusStyle={styles.formColor}
              underlineStyle={styles.formColor}
              underlineFocusStyle={styles.underlineFocus}
              name='password'
              type='password'
              value={this.state.password}
              onChange={this.handleChange} required
            />
          </label>
          <br />
          <RaisedButton
            primary={true}
            label='Log In'
            style={styles.button}
            onClick={this.handleSubmit}
          />
        </form>
        <Divider />
      </div>
    );
  }
}
