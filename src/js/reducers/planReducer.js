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
      newState.destination = action.payload
      break
    case 'UPDATE_ORIGIN':
      newState.origin = action.payload
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