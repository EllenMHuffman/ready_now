'use strict';

class ActivitiesContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {act_id: {'name':'name', 'time':'time', 'clicked':'t/f'}, act_id{}....}
    this.fetchActivities = this.fetchActivities.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.fetchActivities()
  }

  fetchActivities() {
    // AJAX REQUEST TO FETCH DICTIONARY LIST OF ACTIVITIES
  }

  handleClick() {
    let nextState = this.state;
    nextState[act_id]['clicked'] = !(nextState[act_id]['clicked']);
    this.setState(nextState);
  }

  handleSubmit() {
    // HANDLE SUBMIT, PREVENT DEFAULT
  }

  render() {
    let activities = [];
    for (let activity in this.state) {
      activities.push(<ActivityForm key={activity}
                                    dataTime={this.state[activity][1]}
                                    display={this.state[activity][0]} />);
    }
    return (
      <div>
        <h1>Welcome to Ready Now!</h1>
        <br />
        <h2>What do you need to do before youre ready?</h2>
        <form action='/timer'>
          {activities}
          <input type='submit' value='Go!' />
        </form>
      </div>
    );
  }
}

class ActivityForm extends React.Component {
  render() {
    return (
      <div>
        <button onClick={this.props.handleClick}>
        <label> {this.props.display}:
          est. {this.props.dataTime/60}mins</label>
      </div>
    );
  }
}
