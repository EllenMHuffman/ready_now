'use strict';

import React from 'react';


export default class RegisterInputField extends React.Component {
  render() {
    let name = this.props.name;
    let value = this.props.state[name];

    return (
      <label>
        {this.props.display} <input
                                name={name}
                                type={name === 'password' ? 'password' : 'text'}
                                value={value}
                                required={this.props.req}
                                onChange={this.props.handleChange} />
        <br />
      </label>
    );
  }
}
