'use strict';

import React from 'react';
import {
  XYPlot,
  XAxis,
  YAxis,
  LineMarkSeries
} from 'react-vis';


export default class ActivityTimeLineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let chartActivities = this.props.chartActivities;
    let latestActivity = this.props.latestChoice;
    let activitySeries = [];
    const COLORS = ['green', 'blue', 'purple'];

    for (let activity in chartActivities) {
      activitySeries.push(<LineMarkSeries
            key={chartActivities[activity]['actId']}
            className={chartActivities[activity]['actId']}
            style={{stroke: v => COLORS[v]}}
            curve={'curveMonotoneX'}
            data={chartActivities[activity]['chartTimes']['activitySessions']}/>
    )}

    let tickLabels = chartActivities[latestActivity]['chartTimes']['dates'];

    return (
      <div className="LineChart">
        <h3>Activity Time by Session</h3>
        <XYPlot
          margin={{bottom: 65, left: 50}}
          width={300}
          height={300}>
          <XAxis tickFormat={v => tickLabels[v]} tickLabelAngle={-45} />
          <YAxis />
          {activitySeries}
        </XYPlot>
      </div>
    );
  }
}
