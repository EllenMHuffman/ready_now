'use strict';

import moment from 'moment';
import React from 'react';

import {GridList, GridTile} from 'material-ui/GridList';
import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/CheckBox';
import CheckboxOutline from 'material-ui/svg-icons/toggle/check-box-outline-blank';

const colorPalette = {
  'blue': '#34A3BA',
  'white': '#FFF8F4',
  'dkBlue': '#217A8C',
  'black': '#000105',
  'red': '#863b87',
};

const styles = {
  root: {
    marginTop: 30,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 798,
    height: 550,
    overflowY: 'auto',
  },
  titleStyle: {
    color: colorPalette.white,
  },
  checkbox: {
    margin: 8,
    color: colorPalette.white,
  },
  chip: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 20,
    marginLeft: 30,
  },
  chipReady: {
    display: 'flex',
    flexWrap: 'wrap',
    marginLeft: 26,
    marginTop: 10,
    borderRadius: 6,
    backgroundColor: colorPalette.dkBlue,
  },
  chipTotal: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: 16,
    borderRadius: 6,
    backgroundColor: colorPalette.dkBlue,
  },
  text: {
    fontSize: 16,
  },
  sidePanel: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    width: 300,
    marginTop: 58,
  },
  headerSelect: {
    display: 'flex',
    flexWrap: 'wrap',
    height: 110,
    marginTop: 20,
    marginLeft: -46,
    color: colorPalette.white,
    fontFamily: 'Satisfy, cursive',
    fontSize: 100,
  },
  headerActivities: {
    display: 'flex',
    flexWrap: 'wrap',
    height: 110,
    marginTop: -20,
    marginLeft: -8,
    color: colorPalette.white,
    fontFamily: 'Satisfy, cursive',
    fontSize: 100,
  },
  button: {
    borderRadius: 16,
    marginTop: 162,
    marginLeft: 44,
    verticalAlign: 'bottom',
    width: 208,
    height: 80,
  },
  buttonStyle: {
    borderRadius: 16,
  },
  buttonText: {
    color: colorPalette.white,
  }
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
          titleStyle={styles.titleStyle}
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
            titleStyle={styles.titleStyle}
            title={''}
            cols={2}
            rows={2}
          >
            <div style={styles.chip}>
              <Chip
                style={styles.chipReady}
              >
                <span style={styles.text}>Ready at: {eta.format('h:mm a')}</span>
              </Chip>
              <Chip
                style={styles.chipTotal}
              >
                <span style={styles.text}>Total Time: {totalTime[0]} min, {totalTime[1]} sec</span>
              </Chip>
            </div>
          </GridTile>);
      // gridItems.push(
      //     <GridTile
      //       key={'total-time'}
      //       titleStyle={styles.titleStyle}
      //       cols={1}
      //       rows={2}
      //     >
      //     </GridTile>);
    }

    return (
      <div>
        <div style={styles.root}>
          <GridList
            cols={6}
            cellHeight={65}
            padding={1}
            style={styles.gridList}
          >
            {gridItems}
          </GridList>
          <div style={styles.sidePanel}>
            <div>
              <span style={styles.headerSelect}>Select</span>
              <span style={styles.headerActivities}>activities</span>
            </div>
              <RaisedButton
                label={<span style={styles.buttonText}>Click to Start Timers</span>}
                style={styles.button}
                buttonStyle={styles.buttonStyle}
                secondary={true}
                onClick={this.handleSubmit} />
          </div>
        </div>
      </div>
    );
  }
}
