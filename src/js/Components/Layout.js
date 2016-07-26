import React from "react";

import Planner from './Planner'
import Itineraries from './Itineraries'
import MapContainer from './MapContainer'

export default class Layout extends React.Component {
  render() {
    return (
      <div class="row">
        <div class="col-md-4">
          <div class="row">
            <Planner />
            <Itineraries />
          </div>
        </div>
        <MapContainer />
      </div>
    );
  }
}