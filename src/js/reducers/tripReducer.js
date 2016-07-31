import polyUtil from 'polyline-encoded'


const defaultTrip = {
  otpResponse: {},
  fetching: false,
  fetched: false,
  error: null
}

function parseItineraryGeometry(data) {
  data.combinedPoints = []
  for (let i = 0; i < data.legs.length; i++) {
    let points = polyUtil.decode(data.legs[i].legGeometry.points)
    data.combinedPoints = data.combinedPoints.concat(points)
    data.legs[i].points = points
  }
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
      newState.error = null
      break
    case 'TRIP_PLANNABLE_REJECTED':
      newState.fetching = false
      newState.error = action.payload
      break
    case 'TRIP_PLANNABLE_FULFILLED':
      newState.fetching = false
      if(action.payload.error) {
        newState.error = action.payload.error.msg
      } else {
        newState.error = null
        newState.fetched = true
        newState.otpResponse = action.payload
        for (let i = newState.otpResponse.data.plan.itineraries.length - 1; i >= 0; i--) {
          parseItineraryGeometry(newState.otpResponse.data.plan.itineraries[i])
        }
      }
      break
  }

  return newState
}