import { combineReducers } from "redux"

import activeItinerary from './activeItineraryReducer'
import plan from "./planReducer"
import trip from "./tripReducer"

export default combineReducers({
  activeItinerary,
  plan,
  trip
})