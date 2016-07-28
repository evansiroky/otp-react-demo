import jsonp from 'browser-jsonp'
import React from "react"
import Autocomplete from 'react-autocomplete'
import { connect } from "react-redux"

import '../../css/Geocoder.css'

import { selectGeocodeResult } from '../actions/planActions'

const renderItem = function(item, isHighlighted) {
  return (
    <div
      class={isHighlighted ? 'osm-result highlighted' : 'osm-result'}
      key={item.osm_id}
      id={item.osm_id}
    >{item.display_name}</div>
  )
}

@connect((store) => {
  return {
    plan: store.plan
  }
})
export default class MapquestNominatimGeocoder extends React.Component {

  constructor() {
    super()
    this.state = {
      value: '',
      results: [],
      loading: false
    }
  }

  handleChange(event, value) {
    this.setState({ value, loading: true })
    if(value.length > 2) {
      jsonp({
        url: 'http://open.mapquestapi.com/nominatim/v1/search.php',
        data: {
          key: 'SBEPOnvBxcZOVOCG1KtJNqyl7mF45eJu',
          format: 'json',
          q: value,
          limit: 5,
          bounded: 1,
          viewbox: '-123.2034,45.779,-122.1817,45.2091'
        },
        callbackName: 'json_callback',
        success: (data) => {
          this.setState({ results: data, loading: false })
        }
      })
    }
  }

  handleSelect(value, item) {
    this.setState({ value, results: [ item ] })
    this.props.dispatch(selectGeocodeResult({
      source: this.props.id,
      data: item,
      plan: this.props.plan
    }))
  }

  render() {
    return (
      <div class="form-group address-geocoder">
        <label htmlFor={this.props.id}>{this.props.labelText}</label>
        <Autocomplete
          inputProps={{id: this.props.id, className: 'form-control'}}
          wrapperProps={{className: 'geocode-wrapper' }}
          ref="autocomplete"
          value={this.state.value}
          items={this.state.results}
          getItemValue={(item) => item.display_name}
          onSelect={this.handleSelect.bind(this)}
          onChange={this.handleChange.bind(this)}
          renderItem={renderItem}
        />
      </div>
    )
  }
}