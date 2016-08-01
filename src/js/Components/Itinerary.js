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

  handleCollapseItineraryDetails() {
    this.props.dispatch(deactivateItinerary())
  }

  handleCollapseLegDetails(legIdx) {
    this.props.dispatch(deactivateLeg(legIdx))
  }

  handleViewItineraryDetails() {
    this.props.dispatch(activateItinerary({ idx: this.props.idx, data: this.props.data }))
  }

  handleViewLegDetails(legIdx) {
    this.props.dispatch(activateLeg(legIdx))
  }

  render() {
    const isActiveItinerary = this.props.idx === this.props.activeItinerary.idx
    return (
      <div class='panel panel-default itinerary' key={'itinerary-' + this.props.idx} >
        <div class='panel-heading'>
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
            (
            ${this.props.data.duration >= 2700 && 'about ' }
            ${moment.duration(this.props.data.duration, 'seconds').humanize()}
            )`  }
          </p>
        </div>
        {!isActiveItinerary &&
          <div>
            <p class='itinerary-collapse-control'>
              <a onClick={this.handleViewItineraryDetails.bind(this)} >View Details</a>
            </p>
          </div>
        }
        {isActiveItinerary &&
          <div class='active-itinerary'>
            {this.props.data.legs.map((leg, legIdx) => {
              
              const legIsActive = this.props.activeItinerary.activeLegs.indexOf(legIdx) > -1
              console.log(leg)

              return <div class='panel panel-default' key={`itinerary-leg-detail-${legIdx}`} >
                <div class='panel-heading itinerary-leg-detail' >
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
                {!legIsActive && 
                  <div>
                    <p class='leg-collapse-control'>
                      <a onClick={this.handleViewLegDetails.bind(this, legIdx)} >View Details</a>
                    </p>
                  </div>
                }
                {legIsActive && 
                  <div class='active-leg'>
                    {leg.transitLeg &&
                      <div>
                        <p>{`${parseTime(leg.startTime)} @ ${leg.from.name}`}</p>
                        <p>{`${parseTime(leg.endTime)} @ ${leg.to.name}`}</p>
                      </div>
                    }
                    {!leg.transitLeg &&
                      leg.steps.map((step, stepIdx) => {
                        console.log(step)
                        console.log(absSlugs)
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
                    <p class='leg-collapse-control'>
                      <a onClick={this.handleCollapseLegDetails.bind(this, legIdx)} >Collapse</a>
                    </p>
                  </div>   
                }
              </div>
            })}
            <p class='itinerary-collapse-control'>
              <a onClick={this.handleCollapseItineraryDetails.bind(this)} >Collapse</a>
            </p>
          </div>
        }
      </div>
    )
  }
}