import moment from 'moment-timezone'

var defaultPlan = {
  origin: {},
  destination: {},
  deparr: 'depart',
  time: moment().tz("America/Los_Angeles")
}

export default function reducer(state=defaultPlan, action) {
  switch (action.type) {
    case 'UPDATE_TRIP_END':
      console.log('UPDATE_TRIP_END', state, action)
      break
  }
  return state
}