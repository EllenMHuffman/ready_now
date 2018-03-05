'use strict';

import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

const styles = {
  form: {
    margin: 20,
  },
  button: {
    margin: 12,
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
    console.log('Login ' + this.state.username);
    return(
      <div>
        <h1>Log In</h1>
        <form style={styles.form}>
          <label>
            <TextField
              hintText='Username'
              name='username'
              type='text'
              value={this.state.username}
              onChange={this.handleChange} required
            />
          </label>
          <br />
          <label>
            <TextField
              hintText='Password'
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
