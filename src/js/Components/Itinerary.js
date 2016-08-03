import moment from 'moment-timezone'
import React from "react"
import { connect } from "react-redux"

import { activateItinerary, deactivateItinerary,
          activateLeg, deactivateLeg } from '../actions/itineraryActions'
import { timezone } from '../config.js'


const relSlugs = {
  'DEPART': 'Start',
  'HARD_LEFT': 'Turn Hard Left',
  'LEFT': 'Turn Left',
  'SLIGHTLY_LEFT': 'Turn Slightly Left',
  'CONTINUE': 'Turn Continue',
  'SLIGHTLY_RIGHT': 'Turn Slightly Right',
  'RIGHT': 'Turn Right',
  'HARD_RIGHT': 'Turn Hard Right',
  'CIRCLE_CLOCKWISE': 'Circle Clockwise',
  'CIRCLE_COUNTERCLOCKWISE': 'Circle Counter-clockwise',
  'ELEVATOR': 'Enter Elevator',
  'UTURN_LEFT': 'U-Turn Left',
  'UTURN_RIGHT': 'U-Turn Right',
}

const absSlugs = {
  'NORTH': 'North',
  'NORTHEAST': 'Northeast',
  'EAST': 'East',
  'SOUTHEAST': 'Southeast',
  'SOUTH': 'South',
  'SOUTHWEST': 'Southwest',
  'WEST': 'West',
  'NORTHWEST': 'Northwest',
}

function parseTime(t) {
  return moment.tz(t, timezone).format('h:mm A')
}

function prettyDistance(d) {
  if(d < 150) {
    return `${parseInt(d * 3.28084, 10)} feet`
  } else {
    return `${(d * 0.000621371).toFixed(1)} miles`
  }
}

@connect((store) => {
  return { 
    activeItinerary: store.activeItinerary
  }
})
export default class Itinerary extends React.Component {

  handleItineraryToggle() {
    if(this.isActiveItinerary()) {
      this.props.dispatch(deactivateItinerary())
    } else {
      this.props.dispatch(activateItinerary({ idx: this.props.idx, data: this.props.data }))
    }
  }

  handleLegToggle(legIdx) {
    if(this.isActiveLeg(legIdx)) {
      this.props.dispatch(deactivateLeg(legIdx))
    } else {
      this.props.dispatch(activateLeg(legIdx))
    }
  }

  isActiveItinerary() {
    return this.props.idx === this.props.activeItinerary.idx
  }

  isActiveLeg(legIdx) {
    return this.props.activeItinerary.activeLegs.indexOf(legIdx) > -1
  }

  render() {
    const isActiveItinerary = this.isActiveItinerary()
    return (
      <div class='panel panel-default itinerary' key={'itinerary-' + this.props.idx} >
        <div class='panel-heading itinerary-summary-container' 
              onClick={this.handleItineraryToggle.bind(this)}>
          <div class='itinerary-summary'>
            <div class='itinerary-icon-summary'>
              {
                // summary
                this.props.data.legs.map((leg, idx) => {
                  return <div 
                      class='itinerary-summary-leg' 
                      key={`itinerary-summary-${this.props.idx}-leg-${idx}`} >
                    {idx > 0 && 
                      <span> > </span>
                    }
                    <span class={'otp-legMode-icon otp-legMode-icon-' + leg.mode} />
                    {leg.transitLeg &&
                      <span class='leg-title'>{leg.routeShortName || leg.routeLongName}</span>
                    }
                  </div>
                })
              }
            </div>
            <p class='itinerary-timing-summary'>
              { `${parseTime(this.props.data.startTime)} - 
                ${parseTime(this.props.data.endTime)} 
                (${(this.props.data.duration >= 2700 ? 'about ' : '' ) + 
                  moment.duration(this.props.data.duration, 'seconds').humanize()})` }
            </p>
          </div>
          <div class='itinerary-summary-toggler'>
            <span class={ `summary-toggle-icon glyphicon 
                glyphicon-triangle-${isActiveItinerary ? 'bottom' : 'left'}` }
              aria-hidden="true" />
          </div>
        </div>
        {isActiveItinerary &&
          <div class='active-body'>
            {this.props.data.legs.map((leg, legIdx) => {
              
              const legIsActive = this.isActiveLeg(legIdx)

              return <div class='panel panel-default' key={`itinerary-leg-detail-${legIdx}`} >
                <div class='panel-heading itinerary-summary-container' 
                      onClick={this.handleLegToggle.bind(this, legIdx)}>
                  <div class='itinerary-summary'>
                    <span class={'otp-legMode-icon otp-legMode-icon-' + leg.mode} />
                    {leg.transitLeg &&
                      <span class='leg-title'>
                        {(leg.routeShortName && leg.routeLongName) &&
                         `${leg.routeShortName} - ${leg.routeLongName}`}
                        {(leg.routeShortName && !leg.routeLongName) &&
                          leg.routeShortName}
                        {(!leg.routeShortName && leg.routeLongName) &&
                          leg.routeLongName}
                        {leg.headsign && ` to ${leg.headsign}`}
                      </span>
                    }
                    {!leg.transitLeg &&
                      <span class='leg-title'>
                        {`${leg.mode} ${prettyDistance(leg.distance)} to ${leg.to.name}`}
                      </span>
                    }
                  </div>
                  <div class='itinerary-summary-toggler'>
                    <span class={ `summary-toggle-icon glyphicon 
                        glyphicon-triangle-${legIsActive ? 'bottom' : 'left'}` }
                      aria-hidden="true" />
                  </div>
                </div>
                {legIsActive && 
                  <div class='active-body'>
                    {leg.transitLeg &&
                      <div>
                        <p>{`${parseTime(leg.startTime)} @ ${leg.from.name}`}</p>
                        <p>{`${parseTime(leg.endTime)} @ ${leg.to.name}`}</p>
                      </div>
                    }
                    {!leg.transitLeg &&
                      leg.steps.map((step, stepIdx) => {
                        return <div key={`itinerary-leg-detail-${legIdx}-step-${stepIdx}`}>
                          <p>
                            <span class={`otp-legStepLabel-icon 
                              otp-legStep-icon-${step.relativeDirection === 'DEPART' ? 
                                                  'CONTINUE' :
                                                  step.relativeDirection}`} />
                            <span class='non-transit-step-description'>
                              {`${relSlugs[step.relativeDirection]} on ${step.streetName}`}
                              {stepIdx === 0 && 
                                ` heading ${absSlugs[step.absoluteDirection]}`}
                              {` for ${prettyDistance(step.distance)}`}
                            </span>
                          </p>
                        </div>
                      })
                    }
                    <p class='itinerary-collapse-control' 
                        onClick={this.handleLegToggle.bind(this, legIdx)} >
                      <span class='glyphicon glyphicon-triangle-top' aria-hidden="true" />
                    </p>
                  </div>   
                }
              </div>
            })}
            <p class='itinerary-collapse-control' onClick={this.handleItineraryToggle.bind(this)} >
              <span class='glyphicon glyphicon-triangle-top' aria-hidden="true" />
            </p>
          </div>
        }
      </div>
    )
  }
}