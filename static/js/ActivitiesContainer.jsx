'use strict';

import moment from 'moment';
import React from 'react';

import {GridList, GridTile} from 'material-ui/GridList';
import Chip from 'material-ui/Chip';
import {cyan500} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/CheckBox';
import CheckboxOutline from 'material-ui/svg-icons/toggle/check-box-outline-blank';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 798,
    height: 550,
    overflowY: 'auto',
  },
  chip: {
    margin: 'auto',
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  button: {
    margin: 12,
  },
  checkbox: {
    margin: 8,
    color: 'white',
  },
};


export default class ActivitiesContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activityInfo: [],
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.gridItems = this.gridItems.bind(this);
  }

  componentWillMount() {
    fetch('/api/get-activities-loggedin', {
      method: 'post',
      credentials: 'include'
    })
    .then((response) => response.json())
    .then((data) =>  this.setState({['activityInfo']: data}));
  }

  calculateTime() {
    let totalTime = 0;

    for (let activity of this.state.activityInfo) {
      if (activity.clicked === true) {
        totalTime += activity.time;
      }
    }
    return totalTime;
  }

  formatTime(secs) {
    let time = moment.duration(secs, 'seconds')
    let minutes = time.minutes();
    let seconds = time.seconds() % 60;
    seconds = ('0' + seconds).slice(-2);

    return [minutes, seconds]
  }

  calculateETA() {
    let timeNow = moment();
    let totalTime = this.calculateTime();

    return timeNow.add(totalTime, 's');
  }

  handleClick(activity) {
    activity.clicked = !activity.clicked;
    this.setState(this.state);
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
    return this.state.activityInfo.map((activity) => {

      let time = this.formatTime(activity.time);
      return (
        <GridTile
          key={activity.actId}
          title={activity.name + ', ' + time[0] + ':' + time[1] + ' mins'}
          tooltip={activity.time}
          actionIcon={<Checkbox style={styles.checkbox}
                                uncheckedIcon={<CheckboxOutline color='#000000' />}
                                checked={activity.clicked}
                                onClick={() =>this.handleClick(activity)} />
                      }
          actionPosition='left'
          titlePosition='bottom'
          titleBackground='linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
          cols={activity.pair ? 1 : 2}
          rows={2}
        >
        <img src={activity.img} />
      </GridTile>
      )
    });
  }

  render() {
    let totalTime = this.formatTime(this.calculateTime());
    let eta = this.calculateETA()

    let gridItems = null;

    if (this.state.activityInfo.length > 0) {
      gridItems = [this.gridItems()]
      gridItems.push(
          <GridTile
            key={'eta-time'}
            title={''}
            cols={1}
            rows={2}
          >
            <Chip
              style={styles.chip}
              backgroundColor={cyan500}
            >
              <h3 style={{color: 'white'}}>Ready at:</h3>
              <p id='total-time' style={{color: 'white'}}>{eta.format('h:mm a')}</p>
            </Chip>
          </GridTile>);
      gridItems.push(
          <GridTile
            key={'total-time'}
            cols={1}
            rows={2}
          >
            <Chip
              style={styles.chip}
              backgroundColor={cyan500}
            >
              <h3 style={{color: 'white'}}>Total Time:</h3>
              <p id='total-time' style={{color: 'white'}}>{totalTime[0]} min, {totalTime[1]} sec</p>
            </Chip>
          </GridTile>);
    }

    return (
      <div>
        <h3>Select your activities:</h3>
        <div style={styles.root}>
          <GridList
            cols={6}
            cellHeight={65}
            padding={1}
            style={styles.gridList}
          >
            {gridItems}
          </GridList>
          <RaisedButton
            label={<b>Click to Start Timers</b>}
            style={{width: 200, height: 100}}
            primary={true}
            onClick={this.handleSubmit} />
        </div>
      </div>
    );
  }
}
