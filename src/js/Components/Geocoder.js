import React from "react"
import { connect } from "react-redux"
import ReactSelectGeocoder from 'react-select-geocoder'

import 'react-select-geocoder/node_modules/react-select/dist/react-select.min.css'

import { mapzenSearchKey, mapzenSearchBoundary } from '../config'
import { selectGeocodeResult } from '../actions/planActions'


@connect((store) => {
  return {
    plan: store.plan
  }
})
export default class Geocoder extends React.Component {

  handleChange(data) {
    this.props.dispatch(selectGeocodeResult({
      source: this.props.id,
      data,
      plan: this.props.plan
    }))
  }

  render() {
    return (
      <ReactSelectGeocoder 
        apiKey={ mapzenSearchKey }
        boundary={ mapzenSearchBoundary }
        onChange={this.handleChange.bind(this)}
        placeholder={this.props.placeholder} />
    )
  }
}