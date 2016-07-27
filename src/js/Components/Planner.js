import React from "react";

import MapquestNominatimGeocoder from './MapquestNominatimGeocoder'

export default class Planner extends React.Component {
  render() {
    return (
      <div class="bg-primary section">
        <h2>Plan</h2>
        <div class="bg-info">
          <MapquestNominatimGeocoder id='from' labelText='From' />
          <MapquestNominatimGeocoder id='to' labelText='To' />
          <label>Timing</label>
          <select>
            <option value="dep">Depart At</option>
            <option value="arr">Arrive By</option>
          </select>
        </div>
      </div>
    )
  }
}