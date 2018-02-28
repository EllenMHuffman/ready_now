'use strict';

import React from 'react';

export default class FriendOption extends React.Component {
  render() {
    return (
      <option value={this.props.phone}>{this.props.name}</option>
    );
  }
}
