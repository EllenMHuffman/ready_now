'use strict';

import React from 'react';
import ActivityButton from './ActivityButton';


export default class ActivitiesContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.fetchActivities = this.fetchActivities.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchActivities();
  }

  fetchActivities() {
    fetch('/api/get-activities', {
      method: 'post',
      credentials: 'include'
    })
    .then((response) => response.json())
    .then((data) =>  this.setState({data}));
  }

  calculateTime() {
    let totalTime = 0;
    for (let actId in this.state.data) {
      if (this.state.data[actId]['clicked'] === true) {
        totalTime += this.state.data[actId]['time'];
      }
    }
    return (totalTime/60).toFixed(2);
  }

  handleClick(event) {
    event.preventDefault();
    let actId = event.target.value;
    let nextState = this.state.data;
    nextState[actId]['clicked'] = !(nextState[actId]['clicked']);
    this.setState(nextState);
  }

  handleSubmit(event) {
    event.preventDefault();
    fetch('/api/add-session', {
      method: 'post',
      credentials: 'include'
    });
    this.props.setTimers(this.state.data);
  }

  render() {
    let activities = [];
    for (let actId in this.state.data) {
      activities.push(<ActivityButton key={actId}
                                      actId={actId}
                                      time={this.state.data[actId]['time']}
                                      name={this.state.data[actId]['name']}
                                      handleClick={this.handleClick} />);
    }
    return (
      <div>
        <h1>Welcome to Ready Now!</h1>
        <br />
        <h2>What do you need to do?</h2>
        <form onSubmit={this.handleSubmit}>
          {activities}
          <br />
          <b>Total time: </b>
          <span id='total-time'>{this.calculateTime()}</span>
          <br />
          <label>
            <input type='submit' value='Go!' />
          </label>
        </form>
      </div>
    );
  }
}
