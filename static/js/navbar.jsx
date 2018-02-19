'use strict';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {'response': false};
    this.validateUser = this.validateUser.bind(this);
    this.validateUser();
  }

  validateUser() {
    fetch('/api/validate-user', {method: 'post',
                                 credentials: 'include'})
      .then((response)=> response.json())
      .then((data)=>  this.setState({'response': data.value}));
  }

  render() {
    let buttons = [<button key='home'
                    onClick={()=> location.href='/'}>Home</button>];

    if (this.state['response'] === true) {
      buttons.push(<button key='logout'
                    onClick={()=> location.href='/logout'}>Log Out</button>);
      buttons.push(<button key='profile'
                    onClick={()=> location.href='/profile'}>Profile</button>);
    } else {
      buttons.push(<button key='register'
                    onClick={()=> location.href='/register'}>Register</button>);
      buttons.push(<button key='login'
                    onClick={()=> location.href='/login'}>Log In</button>);
    }

    return (<div>{buttons}</div>);
  }
}
