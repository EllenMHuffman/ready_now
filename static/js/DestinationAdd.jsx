'use strict';

import React from 'react';
import InputField from './InputField';


export default class DestinationAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
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

  handleSubmit(event) {
    event.preventDefault();

    let data = {
      name: this.state.name,
      street: this.state.street,
      city: this.state.city,
      state: this.state.state,
      zipcode: this.state.zipcode,
    };

    fetch('/api/add-destination', {
      method: 'POST',
      body: JSON.stringify(data),
      credentials: 'include'
    })
      .then((response)=> response.json())
      .then((data)=> {
        data.value
            ? alert('Successfully added destination info')
            : alert('Update unsuccessful. Please try again.');
      })
      .then(this.props.updateInfo);
  }

  render() {
    let info = [
      ['name', 'Destination Name: '],
      ['street', 'Street: '],
      ['city', 'City: '],
      ['state', 'State: '],
      ['zipcode', 'Zipcode: ']
    ];

    let infoFields = [];

    for (let i of info) {
      infoFields.push(<InputField key={i[0]}
                                  name={i[0]}
                                  display={i[1]}
                                  req={'required'}
                                  handleChange={this.handleChange}
                                  state={this.state} />);
    }
    return (
      <div>
        <h2>Enter destination information.</h2>
        <h3>(All fields are required)</h3>
        <form onSubmit={this.handleSubmit}>
          {infoFields}
          <input type='submit' value='Save Destination' />
        </form>
      </div>
    );
  }
}
