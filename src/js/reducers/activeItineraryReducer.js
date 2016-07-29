var defaultActiveItinerary = {
  idx: -1,
  data: {},
  activeLegs: []
}

export default function reducer(state=defaultActiveItinerary, action) {

  let newState = {...state}

  switch (action.type) {
    case 'SELECT_ITINERARY':
      newState = action.payload
      newState.activeLegs = []
      break
    case 'CLEAR_ACTIVE_ITINERARY':
      newState = defaultActiveItinerary
      break
    case 'ACTIVATE_LEG':
      newState.activeLegs = state.activeLegs.slice(0, state.activeLegs.length)
      newState.activeLegs.push(action.payload)
      break
    case 'DEACTIVATE_LEG':
      newState.activeLegs = state.activeLegs.slice(0, state.activeLegs.length)
      const idx = newState.activeLegs.indexOf(action.payload)
      if(idx > -1) {
        newState.activeLegs.splice(idx, 1)
      }
      break
  }

  return newState
}