'use strict';

import React from 'react';


export default class ActivityButton extends React.Component {
  render() {
    return (
      <div>
        <button value={this.props.actId} onClick={this.props.handleClick}>
          {this.props.name}: ~{(this.props.time/60).toFixed(2)} mins</button>
      </div>
    );
  }
}
