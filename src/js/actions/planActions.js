import axios from 'axios'
import moment from 'moment-timezone'

import { otpUrl, timeParseFormat, timezone } from '../config'
import { deactivateItinerary } from './itineraryActions'


function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}


export function planTripMaybe(query) {
  return function (dispatch) {
    if(query.origin.lat && query.destination.lat) {
      // trip can be planned
      dispatch(deactivateItinerary())
      dispatch(tripPlannable(query))
    } else {
      // not enough info to plan trip
      dispatch(tripUnplannable(query))
    }
  }
}

export function tripPlannable(query) {
  // assemble url to query
  const dt = moment.tz(query.time, timeParseFormat, timezone)
  const params = {
    arriveBy: query.deparr === 'arr',
    date: dt.format('YYYY-MM-DD'),
    fromPlace: `${query.origin.lat},${query.origin.lon}`,
    maxTransfers: 3,
    numItineraries: 3,
    routerId: 'default',
    time: dt.format('h:mm A'),
    toPlace: `${query.destination.lat},${query.destination.lon}`
  }

  return {
    type: 'TRIP_PLANNABLE',
    payload: axios.get(otpUrl + '/routers/default/plan', { params })
  }
}

export function tripUnplannable(query) {
  return {
    type: 'TRIP_UNPLANNABLE',
    payload: query
  }
}

export function selectGeocodeResult(data) {
  return function (dispatch) {

    const query = {...data.plan}

    let tripEndType = ''

    if(data.source === 'from') {
      if(data.data) {
        query.origin.lat = data.data.geometry.coordinates[1]
        query.origin.lon = data.data.geometry.coordinates[0]
      } else {
        query.origin.lat = null
      }
      tripEndType = 'UPDATE_ORIGIN'
    } else {
      if(data.data) {
        query.destination.lat = data.data.geometry.coordinates[1]
        query.destination.lon = data.data.geometry.coordinates[0]
      } else {
        query.destination.lat = null
      }
      tripEndType = 'UPDATE_DESTINATION'
    } 

    dispatch({
      type: tripEndType,
      payload: {
        lat: data.data.geometry.coordinates[1],
        lon: data.data.geometry.coordinates[0],
        label: data.data.properties.label
      }
    })

    dispatch(planTripMaybe(query))
  }
}

export function switchGeocoderInput(data) {
  return function (dispatch) {

    const query = clone(data.plan)
    const oldDestination = clone(query.destination)
    const oldOrigin = clone(query.origin)
    query.destination = query.origin
    query.origin = oldDestination

    dispatch({
      type: 'UPDATE_DESTINATION',
      payload: oldOrigin
    })

    dispatch({
      type: 'UPDATE_ORIGIN',
      payload: oldDestination
    })

    dispatch(planTripMaybe(query))
  }
}

export function updateTiming(data) {
  return function (dispatch) {

    dispatch({
      type: 'UPDATE_TIMING',
      payload: data
    })

    const query = {...data.plan}

    if(data.deparr) {
      query.deparr = data.deparr
    } else {
      query.time = data.time
    }

    dispatch(planTripMaybe(query))

  }
}