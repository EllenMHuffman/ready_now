'use strict';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {'response': false};
    this.validateUser = this.validateUser.bind(this);
    this.loadHomepage = this.loadHomepage.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
    this.loadRegister = this.loadRegister.bind(this);
    this.loadLogin = this.loadLogin.bind(this);
    this.validateUser();
    console.log('NavBar constructor: ' + this.state.response);
  }

  validateUser() {
    console.log('validateUser called');
    fetch('/api/validate-user', {method: 'post',
                                 credentials: 'include'})
      .then((response)=> response.json())
      .then((data)=>  this.setState({'response': data.value}));
  }

  loadHomepage(event) {
    ReactDOM.render(
      <ActivitiesContainer />, document.getElementById('root'));
  }

  logoutUser(event) {
    fetch('/api/logout', {credentials: 'include'})
      .then((response)=> response.json())
      .then((data)=>  this.setState({'response': data.value}));
    ReactDOM.render(
      <ActivitiesContainer />, document.getElementById('root'));
  }

  loadRegister(event) {
    ReactDOM.render(
      <Register validateUser={this.validateUser} />,
      document.getElementById('account'));
  }

  loadLogin(event) {
    ReactDOM.render(
      <Login validateUser={this.validateUser} />,
      document.getElementById('account'));
  }

  render() {
    console.log('NavBar render: ' + this.state.response);
    let buttons = [<button key='home'
                    onClick={this.loadHomepage}>Home</button>];

    if (this.state['response'] === true) {
      buttons.push(<button key='logout'
                    onClick={this.logoutUser}>Log Out</button>);
      buttons.push(<button key='profile'
                    onClick={()=> location.href='/profile'}>Profile</button>);
    } else {
      buttons.push(<button key='register'
                    onClick={this.loadRegister}>Register</button>);
      buttons.push(<button key='login'
                    onClick={this.loadLogin}>Log In</button>);
    }

    return (<div>{buttons}</div>);
  }
}
