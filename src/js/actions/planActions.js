export function selectGeocodeResult(data) {
  return {
    type: 'UPDATE_TRIP_END',
    payload: data
  }
}

export function updateTiming(data) {
  return {
    type: 'UPDATE_TIMING',
    payload: data
  }
}