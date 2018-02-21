'use strict';

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
    this.showActivities = this.showActivities.bind(this);
    this.setTimers = this.setTimers.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
    this.showRegister = this.showRegister.bind(this);
    this.showLogin = this.showLogin.bind(this);
    this.showProfile = this.showProfile.bind(this);
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

  logoutUser(event) {
    fetch('/api/logout', {credentials: 'include'})
      .then((response)=> response.json())
      .then((data)=>  this.setState({
        'loggedIn': data.value,
        'mainView': 'actLoggedOut'
      }));
    // this.showActivities();
  }

  showRegister(event) {
    this.setState({['accountView']: 'register'})
  }

  showLogin(event) {
    this.setState({['accountView']: 'login'})
  }

  showProfile(event) {
    this.setState({['mainView']: 'profile'})
  }

  render() {
    let buttons = [<button key='home'
                    onClick={this.showActivities}>Home</button>];
    if (this.state['loggedIn']) {
      buttons.push(<button key='logout'
                    onClick={this.logoutUser}>Log Out</button>);
      buttons.push(<button key='profile'
                    onClick={this.showProfile}>Profile</button>);
    } else {
      buttons.push(<button key='register'
                    onClick={this.showRegister}>Register</button>);
      buttons.push(<button key='login'
                    onClick={this.showLogin}>Log In</button>);
    }

    let accountView
    if (this.state['accountView'] === 'login') {
      accountView = <Login validateUser={this.validateUser}
             setLoggedIn={this.setLoggedIn} />
    } else if (this.state['accountView'] === 'register') {
      accountView = <Register validateUser={this.validateUser}
                setLoggedIn={this.setLoggedIn} />
    } else {
      accountView = null
    }

    let mainView
    if (['activities', 'actLoggedIn', 'actLoggedOut'].includes(
      this.state['mainView'])) {
        console.log(this.state['mainView']);
        mainView = <ActivitiesContainer setTimers={this.setTimers}/>;
    } else if (this.state['mainView'] === 'timers') {
      mainView = <TimersContainer data={this.state.timerData} />;
    } else if (this.state['mainView'] === 'profile') {
      mainView = <ProfileContainer />;
    }

    return (
      <div>
        {buttons}
        {accountView}
        {mainView}
      </div>
    );
  }
}
