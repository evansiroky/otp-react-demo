import React from "react"
import { Polyline } from 'react-leaflet'


export default class AlternateRoute extends React.Component {

  render() {
    return (
      <Polyline color={'grey'} 
        opacity={1}
        positions={this.props.positions}
        ref={(polyline) => {
          // make sure alternate route polylines are at the back of the map
          if(polyline) {
            // I think I might be causing a memory leak with this?
            polyline.leafletElement.bringToBack()
          }
        }} />
    )
  }
}