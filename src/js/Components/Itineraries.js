import React from "react"
import { connect } from "react-redux"

import Itinerary from './Itinerary'

import spinner from '../../assets/spinner-24px.svg'
import '../../css/Itineraries.css'


@connect((store) => {
  return {
    trip: store.trip
  }
})
export default class Itineraries extends React.Component {
  render() {
    const itineraries = this.props.trip.fetched ? this.props.trip.otpResponse.data.plan.itineraries : []
    return (
      <div class="bg-primary section">
        <h2>Itineraries</h2>

        <div class="bg-info content">

          {!this.props.trip.fetched && !this.props.trip.error && !this.props.trip.fetching &&
            // trip has not been fetched
            <div class="alert alert-warning">
              Please enter the "from" and "to" locations
            </div>
          }

          {this.props.trip.fetching &&
            // trip is being fetched
            <div class="alert alert-info trip-fetching">
              <img src={spinner} alt="Spinner" />
              <p>Calculating trip...</p>
            </div>
          } 

          {this.props.trip.error &&
            // an error occurred while fetching trip
            <div class="alert alert-danger">
              <p>An error occurred while trying to plan the trip</p>
              {this.props.trip.otpErrorMsg &&
                <p>{this.props.trip.error}</p>
              }
            </div>
          }

          {this.props.trip.fetched &&
            // trip has been fetched
            <div class="fetch-results">
              {itineraries.map((itinerary, idx) => {
                return <Itinerary key={idx} idx={idx} data={itinerary} />
              })}
            </div>
          }

        </div>
      </div>
    )
  }
}