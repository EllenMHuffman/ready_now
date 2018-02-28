'use strict';



import React, { Component } from 'react';
import './App.css';
import '../node_modules/react-vis/dist/style.css';
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  VerticalBarSeries
} from 'react-vis';

class BarChart extends Component {
  constructor(props) {
      super(props);
      this.state = {};
      this.getAverageTimes = this.getAverageTimes.bind(this);
  }

  getAverageTimes() {
    fetch('/api/get-average-times', {
        methods: 'POST',
        credentials: 'include'
    })
    .then((response) => response.json())
    .then((data) => this.setState(data.value))
  }

  render() {
    let data = this.state
    return (
      <div className="BarChart">
        <XYPlot
          xType="ordinal"
          width={300}
          height={300}
          xDistance={100}
          >
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          <VerticalBarSeries
            className="vertical-bar-series"
            data={data}/>
        </XYPlot>
      </div>
    );
  }
}

export default BarChart;
