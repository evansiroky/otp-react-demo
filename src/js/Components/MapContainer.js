import { Icon, LatLngBounds } from 'leaflet'
import React from "react"
import { LayerGroup, Map, Marker, Polyline, TileLayer } from 'react-leaflet'
import { connect } from "react-redux"

import 'leaflet/dist/leaflet.css'
import '../../css/MapContainer.css'

import { defaultMapBounds } from '../config'


function getLatLng(tripEnd) {
  return [parseFloat(tripEnd.lat), parseFloat(tripEnd.lon)]
}

const startIcon = new Icon({
  iconUrl: 'assets/start_icon.png',
  iconSize: [64, 64],
  iconAnchor: [32, 64]
})

const endIcon = new Icon({
  iconUrl: 'assets/end_icon.png',
  iconSize: [64, 64],
  iconAnchor: [32, 64]
})

const modes = ['WALK', 'BICYCLE', 'BUS', 'RAIL', 'TRAM', 'SUBWAY', 'FERRY', 'GONDOLA']
const modeMarkers = {}


for (let i = 0; i < modes.length; i++) {
  modeMarkers[modes[i]] = new Icon({
    iconUrl: `assets/mode/marker-${modes[i]}.png`,
    iconSize: [32, 37],
    iconAnchor: [16, 37]
  })
}

@connect((store) => {
  return {
    activeItinerary: store.activeItinerary,
    plan: store.plan,
    trip: store.trip
  }
})
export default class MapContainer extends React.Component {
  
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
    let bounds = defaultMapBounds
    let displayItinerary = null
    let altPoints = []

    if(this.props.plan.origin.lat || this.props.plan.destination.lat) {
      
      // bounds should be extended to available trip ends and trip legs
      bounds = new LatLngBounds()

      // extend bounds by trip ends
      if(this.props.plan.origin.lat) {
        bounds.extend(getLatLng(this.props.plan.origin))
      }

      if(this.props.plan.destination.lat) {
        bounds.extend(getLatLng(this.props.plan.destination))
      }

      // determine whether to pad single trip end
      if(!(this.props.plan.origin.lat && this.props.plan.destination.lat)) {
        const lon1 = bounds.getEast() + 0.01
        const lon2 = bounds.getEast() - 0.01
        const lat = bounds.getSouth()
        bounds.extend([lat, lon1])
        bounds.extend([lat, lon2])
      }

      // extend bounds by trip legs
      if(this.props.trip.fetched) {
        // trip is available
        const itineraries = this.props.trip.otpResponse.data.plan.itineraries

        if(this.props.activeItinerary.idx > -1) {
          // an itinerary has been selected
          displayItinerary = itineraries[this.props.activeItinerary.idx]
          
          // extend bounds by all legs of active itineraries
          for (let i = displayItinerary.combinedPoints.length - 1; i >= 0; i--) {
            bounds.extend(displayItinerary.combinedPoints[i])
          }

        } else {
          // no itinerary selected

          // set first itinerary as display itinerary
          const itin0 = itineraries[0]
          const extendPoints = [itin0.combinedPoints]
          
          displayItinerary = itin0

          for (let i = 1; i < itineraries.length; i++) {
            altPoints.push(itineraries[i].combinedPoints)
            extendPoints.push(itineraries[i].combinedPoints)
          }

          // extend bounds by all legs of all itineraries
          for (let i = 0; i < extendPoints.length; i++) {
            for (let j = extendPoints[i].length - 1; j >= 0; j--) {
              bounds.extend(extendPoints[i][j])
            }
          }
        }
      }
    }

    return (
      <div class="map-container" style={{ height: this.state.height }}>
        <Map bounds={bounds}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          />
          {this.props.plan.origin.lat && 
            <Marker position={getLatLng(this.props.plan.origin)} icon={startIcon}/>
          }
          {this.props.plan.destination.lat && 
            <Marker position={getLatLng(this.props.plan.destination)} icon={endIcon} />
          }
          {this.props.trip.fetched && 
            this.props.activeItinerary.idx == -1 && 
            this.props.trip.otpResponse.data.plan.itineraries.length > 1 && 
            // Itinerary is not selected, show polylines of other options
            <LayerGroup>
              {altPoints.map((combinedAltPoint) => {
                return <Polyline opacity={1}
                  positions={combinedAltPoint} color={'grey'} />
              })}
            </LayerGroup>
          }
          {displayItinerary &&
            // Display active itinerary details
            <LayerGroup>
              {displayItinerary.legs.map((leg) => {
                return <LayerGroup>
                  <Marker position={getLatLng(leg.from)} icon={modeMarkers[leg.mode]} />
                  <Polyline opacity={1}
                    positions={leg.points} 
                    color={'blue'}
                    dashArray={leg.transitLeg ? null : '10,10'} />
                </LayerGroup>
              })}
            </LayerGroup>
          }
        </Map>
      </div>
    )
  }
}