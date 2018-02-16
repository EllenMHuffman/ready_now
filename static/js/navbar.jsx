'use strict';

class NavBar extends React.Component {
  validateUser() {
    // AJAX request to validate user
    return response;
  }

  render() {
    let response = validateUser();
    let buttons = [<button onClick={()=> location.href='/'}>Home</button>];

    if (response === true) {
      buttons.push(<button onClick={()=> location.href='/logout'}>Log Out</button>);
      buttons.push(<button onClick={()=> location.href='/profile'}>Profile</button>);
    } else {
      buttons.push(<button onClick={()=> location.href='/register'}>Register</button>);
      buttons.push(<button onClick={()=> location.href='/login'}>Log In</button>);
    }

    return <div>{buttons}</div>
  }
}
