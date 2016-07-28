const defaultTrip = {
  trip: {},
  fetching: false,
  fetched: false,
  error: null
}

export default function reducer(state=defaultTrip, action) {

  let newState = {...state}

  switch (action.type) {
    case 'TRIP_UNPLANNABLE':
      newState.trip = {}
      break
    case 'TRIP_PLANNABLE_PENDING':
      newState.fetching = true
      break
    case 'TRIP_PLANNABLE_REJECTED':
      newState.fetching = false
      newState.error = action.payload
      break
    case 'TRIP_PLANNABLE_FULFILLED':
      newState.fetching = false
      newState.fetched = true
      newState.trip = action.payload
      break
  }

  return newState
}
