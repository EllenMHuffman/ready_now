'use strict';

import moment from 'moment';
import React from 'react';

import Chip from 'material-ui/Chip';
import {fade} from 'material-ui/utils/colorManipulator';
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

const colorPalette = {
  blue: '#34A3BA',
  white: '#FFF8F4',
  dkBlue: '#217A8C',
  black: '#000105',
  ltBlue: '#C3ECF4',
};

const timerColors = {
  dkRed: '#AD1414',
  ltRed: '#cc3232',
  orange: '#db7b2b',
  yellow: "#e7b416",
  ltGreen: '#99c140',
  dkGreen: '#2dc937',
};

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  mainPanel: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  tableHead: {
    width: 798,
    backgroundColor: fade('#217A8C', 0.1),
  },
  tableBody: {
    backgroundColor: fade('#217A8C', 0.01),
  },
  sidePanel: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    width: 300,
    marginTop: 78,
    fontFamily: 'Satisfy, cursive',
    fontSize: 100,
  },
  headerStay: {
    display: 'flex',
    flexwrap: 'wrap',
    marginLeft: -46,
    height: 110,
  },
  headerTrack: {
    display: 'flex',
    flexwrap: 'wrap',
    marginTop: -6,
    marginLeft: 4,
    height: 110,
  },
  chip: {
    margin: 6,
  },
  text: {
    color: colorPalette.white,
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
      chipColor: colorPalette.dkBlue,
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
    let actualTime = data.endTime - data.startTime;
    let difference = (this.props.timerData[data.index]['time'] - actualTime);
    let newETA = moment(this.state['projectedETA'] - difference * 1000);

    let nextState = this.state;
    let etaDiff = (this.state.initialETA - newETA) / 1000;

    if (etaDiff > 600) {
      nextState['chipColor'] = timerColors.dkGreen;
    } else if (etaDiff > 300) {
      nextState['chipColor'] = timerColors.ltGreen;
    } else if (etaDiff >= 0) {
      nextState['chipColor'] = colorPalette.blue;
    } else if (etaDiff < -1800 ) {
      nextState['chipColor'] = timerColors.dkRed;
    } else if (etaDiff < -900 ) {
      nextState['chipColor'] = timerColors.ltRed;
    } else if (etaDiff < -300 ) {
      nextState['chipColor'] = timerColors.orange;
    } else if (etaDiff < 0) {
      nextState['chipColor'] = timerColors.yellow;
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
        <TableRowColumn style={{paddingLeft: 106}}>
          <Chip
            style={styles.chip}
            backgroundColor={colorPalette.dkBlue}
          >
            <span style={styles.text}>
              Initial ETA: {initialTime.format('h:mm a')}
            </span>
          </Chip>
        </TableRowColumn>
        <TableRowColumn style={{paddingLeft: 42}}>
          <Chip
            style={styles.chip}
            backgroundColor={this.state.chipColor}
          >
            <span style={styles.text}>
              Projected ETA: {projectedTime.format('h:mm a')}
            </span>
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
      <div style={styles.root} id='timer-root'>
        <div style={styles.mainPanel} id='timer-main'>
          <div>
            <Table style={styles.tableHead} bodyStyle={styles.tableBody}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn style={{paddingLeft: 40}}>
                  Activity
                </TableHeaderColumn>
                <TableHeaderColumn style={{textAlign: 'center', paddingLeft: 52}}>
                  Time Alotted
                </TableHeaderColumn>
                <TableHeaderColumn style={{textAlign: 'right', paddingRight: 40}}>
                  Click to Start to Begin
                </TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
            {this.generateTableBody()}
            </TableBody>
          </Table>
          </div>
          <div style={styles.sidePanel}>
            <span style={styles.headerStay}>Stay on</span>
            <span style={styles.headerTrack}>Track</span>
          </div>
        </div>
        <div id='timer-message' style={{marginTop: 32}}>
          {messageFriend}
        </div>
      </div>
    );
  }
}
