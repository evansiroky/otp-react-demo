import React from "react"

import MapquestNominatimGeocoder from './MapquestNominatimGeocoder'
import TimingSettings from './TimingSettings.js'

import '../../css/Planner.css'

export default class Planner extends React.Component {
  render() {
    return (
      <div class="bg-primary section">
        <h2>Plan</h2>
        <div class="bg-info planner-content">
          <MapquestNominatimGeocoder id='from' labelText='From' />
          <MapquestNominatimGeocoder id='to' labelText='To' />
          <TimingSettings />
        </div>
      </div>
    )
  }
}