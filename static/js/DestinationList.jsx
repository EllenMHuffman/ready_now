'use strict';

import React from 'react';

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
          <li><i>{this.state.data[destId]['name']}:</i> </li>
          <span>
            {this.state.data[destId]['street']},&nbsp;
            {this.state.data[destId]['state']},&nbsp;
            {this.state.data[destId]['zipcode']}
          </span>
        </div>
                        );
      // console.log(destinations);
    }    return (
      <div>
        <h3>Saved Destinations</h3>
        <ul>
          {destinations}
        </ul>
      </div>

    );
  }
}
