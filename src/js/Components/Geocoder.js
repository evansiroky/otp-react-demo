import React from "react"
import ReactSelectGeocoder from 'react-select-geocoder'

import 'react-select-geocoder/node_modules/react-select/dist/react-select.min.css'

import { mapzenSearchKey, mapzenSearchBoundary } from '../config'


export default class Geocoder extends React.Component {

  render() {
    return (
      <ReactSelectGeocoder 
        apiKey={ mapzenSearchKey }
        boundary={ mapzenSearchBoundary }
        placeholder={this.props.placeholder}
        value={this.props.value}
        onChange={this.props.onChange} />
    )
  }
}