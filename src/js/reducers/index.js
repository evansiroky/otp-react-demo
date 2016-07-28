import { combineReducers } from "redux"

import plan from "./planReducer"
import trip from "./tripReducer"

export default combineReducers({
  plan,
  trip
})