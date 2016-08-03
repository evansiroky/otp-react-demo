import React from "react"
import { connect } from "react-redux"

import '../../css/Geocoder.css'

import Geocoder from './Geocoder'
import { selectGeocodeResult, switchGeocoderInput } from '../actions/planActions'
import TimingSettings from './TimingSettings.js'


function getGeocoderValue(tripEnd) {
  return tripEnd.label ? tripEnd : null
}


@connect((store) => {
  return {
    plan: store.plan
  }
})
export default class Planner extends React.Component {

  handleGeocoderChange(id, data) {
    this.props.dispatch(selectGeocodeResult({
      source: id,
      data,
      plan: this.props.plan
    }))
  }

  handleSwitchGeocoderInput() {
    this.props.dispatch(switchGeocoderInput({
      plan: this.props.plan
    }))
  }

  render() {
    return (
      <div class="bg-primary section">
        <h2>Plan</h2>
        <div class="bg-info content">
          <div class="geocoder-container">
            <div class="geocoder-content">
              <Geocoder placeholder={'From'} 
                value={getGeocoderValue(this.props.plan.origin)}
                onChange={this.handleGeocoderChange.bind(this, 'from')} />
              <Geocoder placeholder={'To'} 
                value={getGeocoderValue(this.props.plan.destination)}
                onChange={this.handleGeocoderChange.bind(this, 'to')} />
            </div>
            <div class="geocoder-switch-control">
              <span class="glyphicon glyphicon-sort" 
                aria-hidden="true" 
                onClick={this.handleSwitchGeocoderInput.bind(this)} />
            </div>
          </div>
          <TimingSettings />
        </div>
      </div>
    )
  }
}