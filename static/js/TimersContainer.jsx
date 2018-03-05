'use strict';

import moment from 'moment';
import React from 'react';

import Chip from 'material-ui/Chip';
import {
  lightBlue50,
  lightGreen500,
  lightGreen200,
  yellow500,
  orange500,
  red500,
  red900
} from 'material-ui/styles/colors';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import FriendSelect from './FriendSelect';
import Timer from './Timer';

const styles = {
  chip: {
    margin: 6,
  },
  wrapper: {
    display: 'flex',
    flexwrap: 'wrap',
  },
};


export default class TimersContainer extends React.Component {
  constructor(props) {
    super(props);
    this.calculateETA = this.calculateETA.bind(this);
    this.calculateProjectedETA = this.calculateProjectedETA.bind(this);
    let eta = this.calculateETA();
    this.state = {
      initialETA: eta,
      projectedETA: eta,
      chipColor: lightBlue50
    };
  }

  calculateETA() {
    let timeNow = moment();
    let totalTime = 0;
    for (let actId in this.props.timerData) {
      totalTime += this.props.timerData[actId]['time'];
    }
    return timeNow.add(totalTime, 's');
  }

  calculateProjectedETA(data) {
    debugger;
    let actualTime = data.endTime - data.startTime;
    let difference = (this.props.timerData[data.index]['time'] - actualTime);
    let newETA = moment(this.state['projectedETA'] - difference * 1000);

    let nextState = this.state;
    let etaDiff = (this.state.initialETA - newETA) / 1000;
    console.log(etaDiff);

    if (etaDiff > 600) {
      nextState['chipColor'] = lightGreen500;
    } else if (etaDiff > 300) {
      nextState['chipColor'] = lightGreen200;
    } else if (etaDiff >= 0) {
      nextState['chipColor'] = lightBlue50;
    } else if (etaDiff < -1800 ) {
      nextState['chipColor'] = red900;
    } else if (etaDiff < -900 ) {
      nextState['chipColor'] = red500;
    } else if (etaDiff < -300 ) {
      nextState['chipColor'] = orange500;
    } else if (etaDiff < 0) {
      nextState['chipColor'] = yellow500;
    }
    nextState['projectedETA'] = newETA;
    this.setState({nextState});
  }

  generateTableBody() {
    let initialTime = this.state['initialETA'];
    let projectedTime = this.state['projectedETA'];

    let timerRows = [];

    for (let actId in this.props.timerData) {
      timerRows.push(
        <Timer key={actId}
               actId={actId}
               name={this.props.timerData[actId]['name']}
               time={this.props.timerData[actId]['time']}
               calculateProjectedETA={this.calculateProjectedETA} />
      );
    }
    timerRows.push(
      <TableRow key={90}>
        <TableRowColumn></TableRowColumn>
        <TableRowColumn>
          <Chip
            style={styles.chip}
            backgroundColor={lightBlue50}
          >
            Initial ETA: {initialTime.format('h:mm a')}
          </Chip>
        </TableRowColumn>
        <TableRowColumn>
          <Chip
            style={styles.chip}
            backgroundColor={this.state.chipColor}
          >
            Projected ETA: {projectedTime.format('h:mm a')}
          </Chip>
        </TableRowColumn>
      </TableRow>
    );
    return (
        timerRows
    );
  }

  render() {


    let messageFriend = null;
    if (this.props.loggedIn) {
        messageFriend = <FriendSelect />;
    }

    return (
      <div>
        <h3 style={{margin: 12}}>Use the timers to keep you on track</h3>
        <Table>
          <TableHeader displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Activity</TableHeaderColumn>
              <TableHeaderColumn>Time Alotted</TableHeaderColumn>
              <TableHeaderColumn>Click to Start to Begin</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
          {this.generateTableBody()}
          </TableBody>
        </Table>
        <br />
        <br />
        {messageFriend}
      </div>
    );
  }
}
        // <div>Initial ETA: {initialTime.format('h:mm a')}</div>
        // <div>Projected ETA: {projectedTime.format('h:mm a')}</div>
