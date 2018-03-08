'use strict';

import React from 'react';
import MenuItem from 'material-ui/MenuItem';

const colorPalette = {
  blue: '#34A3BA',
  white: '#FFF8F4',
  dkBlue: '#217A8C',
  black: '#000105',
  ltBlue: '#C3ECF4',
};

const styles = {
  menuItem: {
    color: colorPalette.black,
  },
}

export default class SelectOption extends React.Component {
  statics: {muiName: 'MenuItem'};
  render() {
    return (
      <MenuItem
        key={this.props.key}
        style={styles.menuItem}
        value={this.props.value}
        primaryText={this.props.displayText}
      />
    );
  }
}
