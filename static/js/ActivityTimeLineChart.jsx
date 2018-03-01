'use strict';

import React from 'react';
// import ActivitySeries from './ActivitySeries';
import {
  XYPlot,
  XAxis,
  YAxis,
  LineMarkSeries
} from 'react-vis';


export default class ActivityTimeLineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activity: 1
    };
    this.getActivitySessionTime = this.getActivitySessionTime.bind(this);
    this.getActivitySessionTime();
  }

  getActivitySessionTime() {
    fetch('/api/get-activity-session-time', {
      method: 'POST',
      credentials: 'include'
    })
    .then((response) => response.json())
    .then((data) => this.setState(data));
  }

  render() {
    let times = this.state.activitySessions;
    let tickLabels = this.state.startTimes;
    return (
      <div className="LineChart">
        <h3>Activity Time by Session</h3>
        <XYPlot
          margin={{bottom: 65}}
          width={300}
          height={300}>
          <XAxis tickFormat={v => tickLabels[v]} tickLabelAngle={-45} />
          <YAxis />
          <LineMarkSeries
            className="Activity 1"
            curve={'curveMonotoneX'}
            data={times}/>
        </XYPlot>
      </div>
    );
  }
}

          // <LineMarkSeries
          //   className="linemark-series-example"
          //   style={{
          //     stroke: 'white'
          //   }}
          //   data={[
          //     {x: 1, y: 10},
          //     {x: 2, y: 5},
          //     {x: 3, y: 15}
          //   ]}/>
