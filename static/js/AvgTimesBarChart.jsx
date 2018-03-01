'use strict';

import React, { Component } from 'react';
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalBarSeries
} from 'react-vis';


export default class AvgTimesBarChart extends Component {
  constructor(props) {
      super(props);
      this.state = {};
      this.getAverageTimes = this.getAverageTimes.bind(this);
      this.getAverageTimes();
  }

  getAverageTimes() {
    fetch('/api/get-average-times', {
        method: 'POST',
        credentials: 'include'
    })
    .then((response) => response.json())
    .then((data) => this.setState(data))
  }

  render() {
    let data = this.state.activityAverages;
    console.log(this.state.activityAverages);
    return (
      <div className="BarChart">
        <h3>Average Minutes per Activity</h3>
        <XYPlot
          margin={{bottom: 80}}
          xType="ordinal"
          width={300}
          height={300}
          xDistance={100} >
          <XAxis tickLabelAngle={-45} />
          <YAxis />
          <VerticalBarSeries
            className="vertical-bar-series"
            data={data} />
        </XYPlot>
      </div>
    );
  }
}
