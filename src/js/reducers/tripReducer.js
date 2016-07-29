const defaultTrip = {
  otpResponse: {},
  fetching: false,
  fetched: false,
  error: null
}


export default function reducer(state=defaultTrip, action) {

  let newState = {...state}

  switch (action.type) {
    case 'TRIP_UNPLANNABLE':
      newState.otpResponse = {}
      newState.fetched = false
      break
    case 'TRIP_PLANNABLE_PENDING':
      newState.fetching = true
      newState.fetched = false
      break
    case 'TRIP_PLANNABLE_REJECTED':
      newState.fetching = false
      newState.error = action.payload
      break
    case 'TRIP_PLANNABLE_FULFILLED':
      newState.fetching = false
      newState.fetched = true
      newState.otpResponse = action.payload
      break
  }

  return newState
}