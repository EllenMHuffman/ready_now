'use strict';

class ActivitiesContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.fetchActivities = this.fetchActivities.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchActivities();
  }

  fetchActivities() {
    fetch('/api/get-activities', {method: 'post',
                                  credentials: 'include'})
      .then((response)=> response.json())
      .then((data)=>  this.setState({data}));
  }

  handleClick() {
    let nextState = this.state;
    nextState[act_id]['clicked'] = !(nextState[act_id]['clicked']);
    this.setState(nextState);
  }

  handleSubmit() {
    // HANDLE SUBMIT, PREVENT DEFAULT
    console.log('handleSubmit loaded');
  }

  render() {
    let activities = [];
    for (let act_id in this.state.data) {
      activities.push(<ActivityForm key={act_id}
                                    time={this.state.data[act_id]['time']}
                                    name={this.state.data[act_id]['name']}
                                    handleClick={this.handleClick}
                                    handleSubmit={this.handleSubmit} />);
    }
    return (
      <div>
        <h1>Welcome to Ready Now!</h1>
        <br />
        <h2>What do you need to do?</h2>
        <form>
          {activities}
          <div>
            <b>Total time:</b>
            <span id='UPDATEWITHCLASS'></span>
          </div>
          <button type='submit' onSubmit={this.props.handleSubmit}>Go!</button>
        </form>
      </div>
    );
  }
}

class ActivityForm extends React.Component {
  render() {
    return (
      <div>
        <button onClick={this.props.handleClick}>{this.props.name}:
                         ~{this.props.time/60} mins</button>
      </div>
    );
  }
}
