'use strict';

import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import ActivityTimeLineChart from './ActivityTimeLineChart';

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
  selectField: {
    display: 'inline-block',
    marginTop: 0,
    position: 'relative',
    verticalAlign: 'bottom',
  },
  menuItem: {
    color: colorPalette.black,
  },
  formColor: {
    color: colorPalette.white,
    borderColor: colorPalette.white,
  },
  underlineFocus: {
    borderColor: colorPalette.dkBlue,
  },
};


export default class ActivitySelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activityNames: [],
      showChart: false,
      chartActivities: {
        activity1: {
          actId: null,
          chartTimes: null,
        },
        activity2: {
          actId: null,
          chartTimes: null,
        },
      },
      latestChoice: null,
    };
    this.fetchActivities = this.fetchActivities.bind(this);
    this.handleChangeAct1 = this.handleChangeAct1.bind(this);
    this.handleChangeAct2 = this.handleChangeAct2.bind(this);
    this.menuItems = this.menuItems.bind(this);
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

  handleChangeAct1(event, value) {
    const name = 'activity1';
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

  handleChangeAct2(event, value) {
    const name = 'activity2';
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

  menuItems() {
    return this.state.activityNames.map((activity) => (
      <MenuItem
        key={activity.actId}
        style={styles.menuItem}
        value={activity.actId}
        primaryText={activity.name}
      />
    ));
  }

  render() {
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
            <h3 style={{marginBottom: 0}}>Choose activities to display:</h3>
            <label>
              <SelectField
                style={styles.selectField}
                maxHeight={200}
                floatingLabelText='First Activity'
                floatingLabelFixed={true}
                floatingLabelStyle={styles.formColor}
                floatingLabelFocusStyle={styles.formColor}
                underlineStyle={styles.formColor}
                underlineFocusStyle={styles.underlineFocus}
                value={this.state.chartActivities.activity1.actId}
                onChange={this.handleChangeAct1}
              >
                <MenuItem
                  key={'null1'}
                  style={styles.menuItem}
                  value={null}
                  primaryText={'--'}
                />
                {this.menuItems()}
              </SelectField>
            </label>
            <label>
              <SelectField
                style={styles.selectField}
                maxHeight={200}
                floatingLabelText='Second Activity'
                floatingLabelFixed={true}
                floatingLabelStyle={styles.formColor}
                floatingLabelFocusStyle={styles.formColor}
                underlineStyle={styles.formColor}
                underlineFocusStyle={styles.underlineFocus}
                value={this.state.chartActivities.activity2.actId}
                onChange={this.handleChangeAct2}
              >
                <MenuItem
                  key={'null2'}
                  style={styles.menuItem}
                  value={null}
                  primaryText={'--'}
                />
                {this.menuItems()}
              </SelectField>
            </label>
        </form>
        <br />
        {lineChart}
      </div>
    );
  }
}
