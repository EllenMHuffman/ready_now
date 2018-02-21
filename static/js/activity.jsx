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

  calculateTime() {
    let totalTime = 0;
    for (let act_id in this.state.data) {
      if (this.state.data[act_id]['clicked'] === true) {
        totalTime += this.state.data[act_id]['time'];
      }
    }
    return (totalTime/60).toFixed(2);
  }

  handleClick(event) {
    event.preventDefault();
    let act_id = event.target.value;
    let nextState = this.state.data;
    nextState[act_id]['clicked'] = !(nextState[act_id]['clicked']);
    this.setState(nextState);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.setTimers(this.state.data);
  }

  render() {
    let activities = [];
    for (let act_id in this.state.data) {
      activities.push(<ActivityForm key={act_id}
                                    act_id={act_id}
                                    time={this.state.data[act_id]['time']}
                                    name={this.state.data[act_id]['name']}
                                    handleClick={this.handleClick} />);
    }
    return (
      <div>
        <h1>Welcome to Ready Now!</h1>
        <br />
        <h2>What do you need to do?</h2>
        <form onSubmit={this.handleSubmit}>
          {activities}
          <br />
          <b>Total time: </b>
          <span id='total-time'>{this.calculateTime()}</span>
          <br />
          <label>
            <input type='submit' value='Go!' />
          </label>
        </form>
      </div>
    );
  }
}

class ActivityForm extends React.Component {
  render() {
    return (
      <div>
        <button value={this.props.act_id} onClick={this.props.handleClick}>
          {this.props.name}: ~{(this.props.time/60).toFixed(2)} mins</button>
      </div>
    );
  }
}
