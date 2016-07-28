import axios from 'axios'
import moment from 'moment-timezone'
import querystring from 'query-string'

import { otpUrl, timeParseFormat, timezone } from '../config'


export function planTripMaybe(query) {
  console.log(query)
  if(query.origin.lat && query.destination.lat) {
    // trip can be planned

    // assemble url to query
    const dt = moment.tz(query.time, timeParseFormat, timezone)
    const params = {
      date: dt.format('YYYY-MM-DD'),
      fromPlace: `${query.origin.lat},${query.origin.lon}`,
      maxTransfers: 3,
      routerId: 'default',
      time: dt.format('h:mm A'),
      toPlace: `${query.destination.lat},${query.destination.lon}`
    }

    return {
      type: 'TRIP_PLANNABLE',
      payload: axios.get(otpUrl + 'otp/routers/default/plan?' + querystring.stringify(params))
    }
  } else {
    // not enough info to plan trip
    return {
      type: 'TRIP_UNPLANNABLE',
      payload: query
    }
  }
}

export function selectGeocodeResult(data) {
  return function (dispatch) {

    const query = {...data.plan}

    let tripEndType = ''

    if(data.source === 'from') {
      query.origin = data.data
      tripEndType = 'UPDATE_ORIGIN'
    } else {
      query.destination = data.data
      tripEndType = 'UPDATE_DESTINATION'
    } 

    dispatch({
      type: tripEndType,
      payload: data.data
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