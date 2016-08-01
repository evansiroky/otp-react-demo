import moment from 'moment-timezone'
import React from "react"
import DateTimeField from 'react-bootstrap-datetimepicker'
import { connect } from "react-redux"

import 'react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css'
import '../../css/TimingSettings.css'

import { updateTiming } from '../actions/planActions'
import { timeParseFormat, timezone } from '../config.js'


@connect((store) => {
  return {
    plan: store.plan
  }
})
export default class TimingSettings extends React.Component {

  constructor() {
    super()
    this.state = {
      deparr: 'dep',
      time: moment().tz(timezone).format(timeParseFormat)
    }
  }

  handleDateTimeChange(newDate) {
    this.setState({ time: newDate })
    // create timeout, so many events won't be fired if user is click-happy
    if(this.dateTimeChangeTimer) {
      clearTimeout(this.dateTimeChangeTimer)
    }
    this.dateTimeChangeTimer = setTimeout(() => {
      this.props.dispatch(updateTiming({ plan: this.props.plan, time: newDate }))
    }, 500)
  }

  handleDepArrChange(e) {
    const change = { plan: this.props.plan, deparr: e.target.value }
    this.setState(change)
    this.props.dispatch(updateTiming(change))
  }

  render() {
    return (
      <div class="form-group timing-settings">
        <label>Timing</label>
        <div class="form-inline">
          <div class="deparr-select-container">
            <select onChange={this.handleDepArrChange.bind(this)} 
                    value={this.state.deparr} 
                    class="form-control">
              <option value="dep">Depart At</option>
              <option value="arr">Arrive By</option>
            </select>
          </div>
          <DateTimeField 
            dateTime={this.state.time}
            format={timeParseFormat}
            inputProps={{className: 'form-control datetime-picker-input'}}
            minDate={moment().subtract(1, 'hours')}
            onChange={this.handleDateTimeChange.bind(this)} 
          />
        </div>
      </div>
    )
  }
}