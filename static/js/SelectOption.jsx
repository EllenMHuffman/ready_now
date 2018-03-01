'use strict';

import React from 'react';

export default class SelectOption extends React.Component {
  render() {
    return (
      <option value={this.props.value}>{this.props.displayText}</option>
    );
  }
}
