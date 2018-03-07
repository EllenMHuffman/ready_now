'use strict';

import React from 'react';
import FriendList from './FriendList';
import DestinationList from './DestinationList';
import AvgTimesBarChart from './AvgTimesBarChart';
import ActivitySelect from './ActivitySelect';

const colorPalette = {
  blue: '#34A3BA',
  white: '#FFF8F4',
  dkBlue: '#217A8C',
  black: '#000105',
  ltBlue: '#C3ECF4',
};

const styles = {
  header: {
    marginTop: 18,
    marginBottom: 0,
    marginRight: 40,
    fontFamily: 'Satisfy, sans-serif',
    textAlign: 'right',
    fontSize: 34,
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  chartsPanel: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  form: {
    marginLeft: 30,
    marginTop: -18,
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
  activityField: {
    marginTop: 0,
    width: 230,
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
  infoPanel: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40,
  },
};

export default class ProfileContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: [],
    };
  }

  componentWillMount() {
    fetch('/api/get-user-info', {
      method: 'POST',
      credentials: 'include'
    })
    .then((response) => response.json())
    .then((data) => this.setState(data));
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <h2 style={styles.header}>{this.state.userInfo[0]} {this.state.userInfo[1]}</h2>
        <div id='profile-root' style={styles.root}>
          <div id='profile-charts' style={styles.chartsPanel}>
            <AvgTimesBarChart />
            <ActivitySelect />
          </div>
          <div id='profile-info' style={styles.infoPanel}>
            <FriendList />
            <DestinationList />
          </div>
        </div>
      </div>
    );
  }
}
