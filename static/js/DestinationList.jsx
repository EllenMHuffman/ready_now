'use strict';

import React from 'react';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

const colorPalette = {
  blue: '#34A3BA',
  white: '#FFF8F4',
  dkBlue: '#217A8C',
  black: '#000105',
  ltBlue: '#C3ECF4',
};

export default class DestinationList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.fetchDestinations = this.fetchDestinations.bind(this);
    this.fetchDestinations();
  }

  fetchDestinations() {
    fetch('/api/get-destinations', {
      method: 'post',
      credentials: 'include'
    })
    .then((response) => response.json())
    .then((data) => this.setState({data}));
  }

  render() {
    let destinations = [];
    for (let destId in this.state.data) {
      destinations.push(
        <div key={destId}>
          <ListItem
            primaryText={this.state.data[destId]['name']}
            style={{padding: 2}}
            secondaryText={
              <span style={{color: colorPalette.white}}>
                {this.state.data[destId]['street']},&nbsp;
                {this.state.data[destId]['state']},&nbsp;
                {this.state.data[destId]['zipcode']}
              </span>
            }
          />
        </div>);
    }
    return (
      <div>
        <h3>Saved Destinations</h3>
        <Divider />
        <List>
          {destinations}
        </List>
      </div>
    );
  }
}
