import React from "react"
import { Map, TileLayer } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'
import '../../css/MapContainer.css'

export default class MapContainer extends React.Component {
  constructor() {
    super()
    this.state = {
      position: [45.518977, -122.677742],
      zoom: 10
    }
  }

  updateDimensions() {
    const height = window.innerWidth >= 992 ? window.innerHeight : 400
    this.setState({ height: height })
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
      <div class="map-container" style={{ height: this.state.height }}>
        <Map center={this.state.position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          />
        </Map>
      </div>
    )
  }
}