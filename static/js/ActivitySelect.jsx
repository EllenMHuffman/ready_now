'use strict';

import React from 'react';
import SelectOption from './SelectOption';
import ActivityTimeLineChart from './ActivityTimeLineChart';


export default class ActivitySelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showChart: false,
      chartActivities: {},
      latestChoice: null
    };
    this.fetchActivities = this.fetchActivities.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.fetchActivities();
  }

  fetchActivities() {
    fetch('/api/get-user-activities', {
      method: 'post',
      credentials: 'include'
    })
    .then((response) => response.json())
    .then((data) => this.setState(data));
  }

  handleChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    fetch('/api/get-activity-session-time', {
      method: 'POST',
      body: JSON.stringify([value, name]),
      credentials: 'include'
    })
    .then((response) => response.json())
    .then((data) => {
      let nextState = this.state;
      nextState['chartActivities'][name] = {'actId': value, 'chartTimes': data};
      nextState['showChart'] = true;
      nextState['latestChoice'] = name;
      this.setState(nextState);
    });
  }

  render() {
    let activities = [];
    for (let actId in this.state.activityNames) {
      activities.push(<SelectOption key={actId}
                                    value={actId}
                                    displayText={this.state.activityNames[actId]['name']} />);
    }

    let lineChart;
    if (this.state.showChart === true) {
      lineChart = <ActivityTimeLineChart
                      activityNames={this.state.activityNames}
                      chartActivities={this.state.chartActivities}
                      latestChoice={this.state.latestChoice} />;
    }

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
            <h3>Select activity to display:</h3>
            <label>
              First Activity:
              <br />
              <select name='activity1'
                      value={this.state.value}
                      onChange={this.handleChange}>
                <option value='null'> -- </option>
                {activities}
              </select>
            </label>
            <br />
            <label>
              and Second Activity:
              <br />
              <select name='activity2'
                      value={this.state.value}
                      onChange={this.handleChange}>
                <option value='null'> -- </option>
                {activities}
              </select>
            </label>
            <br />
        </form>
        {lineChart}
      </div>
    );
  }
}
