import React from "react"

import Geocoder from './Geocoder'
import TimingSettings from './TimingSettings.js'


export default class Planner extends React.Component {
  render() {
    return (
      <div class="bg-primary section">
        <h2>Plan</h2>
        <div class="bg-info content">
          <Geocoder id={'from'} placeholder={'From'} />
          <Geocoder id={'to'} placeholder={'To'} />
          <TimingSettings />
        </div>
      </div>
    )
  }
}