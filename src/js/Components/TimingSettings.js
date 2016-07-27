import moment from 'moment-timezone'
import React from "react"
import DateTimeField from 'react-bootstrap-datetimepicker'
import { connect } from "react-redux"

import 'react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css'
import '../../css/TimingSettings.css'

import { updateTiming } from '../actions/planActions'


const parseFormat = 'MM/DD/YY h:mm A'


@connect((store) => {
  return {}
})
export default class TimingSettings extends React.Component {

  constructor() {
    super()
    this.state = {
      deparrValue: 'dep',
      dateTime: moment().tz("America/Los_Angeles").format(parseFormat)
    }
    console.log(this.state)
  }

  handleDateTimeChange(newDate) {
    this.setState({dateTime: newDate})
    // create timeout, so many events won't be fired if user is click-happy
    if(this.dateTimeChangeTimer) {
      clearTimeout(this.dateTimeChangeTimer)
    }
    this.dateTimeChangeTimer = setTimeout(() => {
      this.props.dispatch(updateTiming({ dateTime: newDate }))
    }, 500)
  }

  handleDepArrChange(e) {
    const change = { deparrValue: e.target.value }
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
                    value={this.state.deparrValue} 
                    class="form-control">
              <option value="dep">Depart At</option>
              <option value="arr">Arrive By</option>
            </select>
          </div>
          <DateTimeField 
            dateTime={this.state.dateTime}
            format={parseFormat}
            minDate={moment().subtract(1, 'hours')}
            onChange={this.handleDateTimeChange.bind(this)} 
          />
        </div>
      </div>
    )
  }
}