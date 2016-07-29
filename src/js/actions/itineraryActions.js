export function activateItinerary(payload) {
  return {
    type: 'SELECT_ITINERARY',
    payload
  }
}

export function activateLeg(payload) {
  return {
    type: 'ACTIVATE_LEG',
    payload
  }
}

export function deactivateItinerary() {
  return {
    type: 'CLEAR_ACTIVE_ITINERARY'
  }
}

export function deactivateLeg(payload) {
  return {
    type: 'DEACTIVATE_LEG',
    payload
  }
}