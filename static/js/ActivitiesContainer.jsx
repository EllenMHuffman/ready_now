'use strict';

import moment from 'moment';
import React from 'react';

import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

import ActivityButton from './ActivityButton';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 900,
    height: 600,
    overflowY: 'auto',
  },
};


export default class ActivitiesContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activityInfo: [],
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.gridItems = this.gridItems.bind(this);
  }

  componentWillMount() {
    fetch('/api/get-activities', {
      method: 'post',
      credentials: 'include'
    })
    .then((response) => response.json())
    .then((data) =>  this.setState({['activityInfo']: data}));
  }

  calculateTime() {
    let totalTime = 0;

    for (let actId in this.state.activityInfo) {
      if (this.state.activityInfo[actId]['clicked'] === true) {
        totalTime += this.state.activityInfo[actId]['time'];
      }
    }

    return totalTime;
  }

  formatTime(secs) {
    let time = moment.duration(secs, 'seconds')
    let minutes = time.minutes();
    let seconds = time.seconds() % 60;
    seconds = ("0" + seconds).slice(-2);

    return [minutes, seconds]
  }

  calculateETA() {
    let timeNow = moment();
    let totalTime = this.calculateTime()

    return timeNow.add(totalTime, 's');
  }

  handleClick(event) {
    event.preventDefault();
    let actId = event.target.value;
    let nextState = this.state.activityInfo;
    nextState[actId]['clicked'] = !(nextState[actId]['clicked']);
    this.setState(nextState);
  }

  handleSubmit(event) {
    event.preventDefault();
    fetch('/api/add-session', {
      method: 'post',
      credentials: 'include'
    });
    this.props.setTimers(this.state.activityInfo);
  }

  gridItems() {
    console.log(this.state);
    return (this.state.activityInfo.map((activity) => (
      <GridTile
        key={activity.actId}
        title={activity.name}
        actionIcon={<IconButton onClick={this.handleClick}>
                      <StarBorder color='black' />
                    </IconButton>}
        actionPosition='left'
        titlePosition='bottom'
        titleBackground='linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
        cols={activity.pair ? 1 : 2}
      >
        <img src={activity.img} />
      </GridTile>
          ))
    );
  }

  render() {
    console.log(this.state);
    let activities = [];
    for (let actId in this.state.activityInfo) {
      activities.push(<ActivityButton key={actId}
                                      actId={actId}
                                      time={this.state.activityInfo[actId]['time']}
                                      name={this.state.activityInfo[actId]['name']}
                                      handleClick={this.handleClick} />);
    }

    let totalTime = this.formatTime(this.calculateTime());
    let eta = this.calculateETA()

    let gridItems = null;
    if (this.state.activityInfo.length > 0) {
      gridItems = this.gridItems()
    }

    return (
      <div>
        <h1>Welcome to Ready Now!</h1>
        <br />
        <h2>What do you need to do?</h2>
        <div style={styles.root}>
          <GridList
            cols={6}
            cellHeight={200}
            padding={1}
            style={styles.gridList}
          >
          {gridItems}
          </GridList>
        </div>

        <div>
        <form onSubmit={this.handleSubmit}>
          {activities}
          <br />
          <b>Total time: </b>
          <span id='total-time'>{totalTime[0]} minutes, {totalTime[1]} seconds</span>
          <br />
          <b>You'll be ready at: </b>
          <span id='total-time'>{eta.format('h:mm a')}</span>
          <br />
          <label>
            <input type='submit' value='Go!' />
          </label>
        </form>
        </div>
      </div>
    );
  }
}
