'use strict';

class SettingsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'currentView': 'info'
    };
    this.addFriend = this.addFriend.bind(this);
    this.addDestination = this.addDestination.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
  }

  addFriend(event) {
    this.setState({['currentView']: 'friend'});
  }

  addDestination(event) {
    this.setState({['currentView']: 'destination'});
  }

  updateInfo(event) {
    this.setState({['currentView']: 'info'});
  }

  render() {
    let buttons = [];
    let currentView;

    if (this.state['currentView'] === 'friend') {
      buttons.push(<button key='destination'
                        onClick={this.addDestination}>Add Destination</button>);
      buttons.push(<button key='info'
                        onClick={this.updateInfo}>Update Your Info</button>);
      currentView = [<FriendInput updateInfo={this.updateInfo}/>];

    } else if (this.state['currentView'] === 'destination') {
      buttons.push(<button key='friend'
                        onClick={this.addFriend}>Add Friend Info</button>);
      buttons.push(<button key='info'
                        onClick={this.updateInfo}>Update Your Info</button>);
      currentView = [<DestinationInput />];

    } else if (this.state['currentView'] === 'info') {
      buttons.push(<button key='friend'
                        onClick={this.addFriend}>Add Friend Info</button>);
      buttons.push(<button key='destination'
                        onClick={this.addDestination}>Add Destination</button>);
      currentView = [<UserInfo />];
    }

    return (
      <div>
        <h1>Settings</h1>

          <br />
          {buttons}
          <br />
          {currentView}
      </div>
    );
  }
}

class FriendInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      phone: ''
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
      phone: this.state.phone
    };

    fetch('/api/add-friend', {
      method: 'POST',
      body: JSON.stringify(data),
      credentials: 'include'
    })
      .then((response)=> response.json())
      .then((data)=> {
        data.value
            ? alert('Successfully added friend contact info')
            : alert('Update unsuccessful. Please try again.');
      })
      .then(this.props.updateInfo);
  }

  render() {
    return (
      <div>
        <h2>Enter your friends contact information</h2>
        <form onSubmit={this.handleSubmit}>
          <label>
            Friend Name:
            <input
              name='name'
              type='text'
              value={this.state.name}
              onChange={this.handleChange} required />
          </label>
          <br />
          <label>
            Phone Number:
            <input
              name='phone'
              type='text'
              value={this.state.phone}
              onChange={this.handleChange} required />
          </label>
          <br />
          <input type='submit' value='Submit' />
        </form>
      </div>
    );
  }
}

class DestinationInput extends React.Component {
  render() {
    return (
      <div>

      </div>
    );
  }
}

class UserInfo extends React.Component {
  render() {
    return (
      <div>
        <h2>Update your information</h2>
      </div>
    );
  }
}