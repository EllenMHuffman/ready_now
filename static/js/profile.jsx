'use strict';

class ProfileContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'currentView': 'stats'
    };
  }

  render() {
    let currentView;
    if (this.state['currentView'] === 'stats') {
      currentView = [];
    }

    return (
      <div>
        <h1>Your Profile</h1>

          "user_id"
          <br />
          "first name" "last name"
          <br />
          <br />
      </div>
    );
  }
}