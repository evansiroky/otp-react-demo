import moment from 'moment-timezone'

import { timeParseFormat, timezone } from '../config.js'


var defaultPlan = {
  origin: {},
  destination: {},
  deparr: 'depart',
  time: moment().tz(timezone).format(timeParseFormat)
}

export default function reducer(state=defaultPlan, action) {

  let newState = {...state}

  switch (action.type) {
    case 'UPDATE_DESTINATION':
      newState.destination.lat = action.payload.geometry.coordinates[1]
      newState.destination.lon = action.payload.geometry.coordinates[0]
      break
    case 'UPDATE_ORIGIN':
      newState.origin.lat = action.payload.geometry.coordinates[1]
      newState.origin.lon = action.payload.geometry.coordinates[0]
      break
    case 'UPDATE_TIMING':
      if(action.payload.deparr) {
        newState.deparr = action.payload.deparr
      } else {
        newState.time = action.payload.time
      }
      break
  }

  return newState
}