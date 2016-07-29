import React from "react";

import Planner from './Planner'
import Itineraries from './Itineraries'
import MapContainer from './MapContainer'

import '../../css/Layout.css'


export default class Layout extends React.Component {
  constructor() {
    super()
    this.state = {
      leftColStyle: {

      }
    }
  }

  updateDimensions() {
    if(window.innerWidth >= 992) {
      this.setState({ leftColStyle: { maxHeight: window.innerHeight, overflow: 'auto' }})
    } else {
      this.setState({ leftColStyle: { } })
    }
  }

  componentWillMount() {
    this.updateDimensions()
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this))
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this))
  }

  render() {
    return (
      <div class="row">
        <div class="col-md-4">
          <div class="row" style={this.state.leftColStyle}>
            <Planner />
            <Itineraries />
          </div>
        </div>
        <div class="col-md-8 map-column">
          <MapContainer />
        </div>
      </div>
    );
  }
}