'use strict';

class ActivitiesContainer extends React.Component {
  startActivities() {
    alert('Working!!');
  }

  stopActivities() {
    alert('stahhhhhp')
  }

  calculateETA() {
    let timeNow = moment();
    let totalTime = 0;
    for (let activity in this.props.data) {
      totalTime += this.props.data[activity][1];
    }
    return timeNow.add(totalTime, 's');
  }

  render() {
    let totalTime = this.calculateETA();
    let activities = [];
    for (let activity in this.props.data) {
      let current_activity = this.props.data[activity];
      activities.push(<Activity id={activity} name={current_activity[0]}
                      time={current_activity[1]} />);
    }
    return (<div>
      <button onClick={this.startActivities} type='button' id='start'>Start</button>
      {activities}
      <button onClick={this.stopActivities} type='button' id='stop'>Stop</button>
      <div>Projected ETA: {totalTime.format('h:mm a')}</div>
      </div>)
  }
}

class Activity extends React.Component {
  render() {
    return <div><span> {this.props.name}:</span>
    <span> {(this.props.time)/60} minutes</span></div>
  }
}

class Timer extends React.Component {
  render() {
    return
  }
}