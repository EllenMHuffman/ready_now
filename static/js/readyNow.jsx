'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVert from 'material-ui/svg-icons/navigation/more-vert';
import FlatButton from 'material-ui/FlatButton';
import grey50 from 'material-ui/styles/colors';


import ActivitiesContainer from './ActivitiesContainer';
import Login from './Login';
import ProfileContainer from './ProfileContainer';
import Register from './Register';
import SettingsContainer from './SettingsContainer';
import TimersContainer from './TimersContainer';

const styles = {
  title: {
    cursor: 'pointer',
  },
};


class ReadyNow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'loggedIn': false,
      'accountView': null,
      'mainView': 'activities'
    };
    this.validateUser = this.validateUser.bind(this);
    this.setLoggedIn = this.setLoggedIn.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
    this.showActivities = this.showActivities.bind(this);
    this.setTimers = this.setTimers.bind(this);
    this.getFilteredTimerData = this.getFilteredTimerData.bind(this);
    this.showRegister = this.showRegister.bind(this);
    this.showLogin = this.showLogin.bind(this);
    this.showProfile = this.showProfile.bind(this);
    this.showSettings = this.showSettings.bind(this);
    this.validateUser();
  }

  validateUser() {
    fetch('/api/validate-user', {method: 'post',
                                 credentials: 'include'})
      .then((response)=> response.json())
      .then((data)=>  this.setState({'loggedIn': data.value}));
  }

  setLoggedIn(value) {
    this.setState({
      ['loggedIn']: value,
      ['accountView']: null,
      ['mainView']: 'actLoggedIn'
    });
  }

  logoutUser(event) {
    fetch('/api/logout', {credentials: 'include'})
      .then((response)=> response.json())
      .then((data)=>  this.setState({
        'loggedIn': data.value,
        'mainView': 'actLoggedOut'
      }));
    // this.showActivities();
  }

  showActivities(event) {
    this.setState({
      ['accountView']: null,
      ['mainView']: 'activities',
    });
  }

  setTimers(data) {
    this.setState({['timerData']: data});
    this.setState({['mainView']: 'timers'});
  }

  getFilteredTimerData() {
    let data = this.state.timerData;
    let clickedTimerData = {};
    for (let actId in data) {
      if (data[actId]['clicked'] === true) {
        clickedTimerData[actId] = data[actId];
      }
    }
    return clickedTimerData;
  }

  showRegister(event) {
    this.setState({['accountView']: 'register'});
  }

  showLogin(event) {
    this.setState({['accountView']: 'login'});
  }

  showProfile(event) {
    this.setState({['mainView']: 'profile'});
  }

  showSettings(event) {
    this.setState({['mainView']: 'settings'});
  }

  render() {

    let menuItems = [];
    let profile;
    if (this.state['loggedIn']) {
      menuItems.push(<MenuItem
                        key='logout'
                        primaryText='Log Out'
                        onClick={this.logoutUser} />);
      menuItems.push(<MenuItem
                        key='settings'
                        primaryText='Settings'
                        onClick={this.showSettings} />);
      profile = <FlatButton label='Profile' onClick={this.showProfile} />
    } else {
      menuItems.push(<MenuItem
                        key='register'
                        primaryText='Register'
                        onClick={this.showRegister} />);
      menuItems.push(<MenuItem
                        key='login'
                        primaryText='Login'
                        onClick={this.showLogin} />);
      profile = null;
    }

    let accountView;
    if (this.state['accountView'] === 'login') {
      accountView = <Login validateUser={this.validateUser}
          setLoggedIn={this.setLoggedIn} />
    } else if (this.state['accountView'] === 'register') {
      accountView = <Register validateUser={this.validateUser}
          setLoggedIn={this.setLoggedIn} />
    } else {
      accountView = null
    }

    let mainView;
    if (['activities', 'actLoggedIn', 'actLoggedOut'].includes(
      this.state['mainView'])) {
        mainView = <ActivitiesContainer
            setTimers={this.setTimers}
            loggedIn={this.state.loggedIn} />;
    } else if (this.state['mainView'] === 'timers') {
      mainView = <TimersContainer
          timerData={this.getFilteredTimerData()}
          loggedIn={this.state.loggedIn} />;
    } else if (this.state['mainView'] === 'profile') {
      mainView = <ProfileContainer />;
    } else if (this.state['mainView'] === 'settings') {
      mainView = <SettingsContainer />;
    }

    return (
      <div>
        <AppBar
          title={<span style={styles.title}>Ready Now</span>}
          onTitleClick={this.showActivities}
          iconElementLeft={<IconMenu
                             iconButtonElement={<IconButton iconStyle={{color: 'rgba(255,255,255,1)'}}><MoreVert /></IconButton>}
                             anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                             targetOrigin={{horizontal: 'left', vertical: 'top'}}
                           >
                             {menuItems}
                           </IconMenu>
                          }
          iconElementRight={profile}

        />
        {accountView}
        {mainView}
      </div>
    );
  }
}

const App = () => (
  <MuiThemeProvider>
    <ReadyNow />
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
