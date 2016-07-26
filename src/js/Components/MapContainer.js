import React from "react";

export default class MapContainer extends React.Component {
  constructor() {
    super()
    this.style = { height: '400px' }
  }

  render() {
    return (
      <div class="col-md-8 bg-danger" style={this.style}>
        <h1>MapDiv</h1>
      </div>
    )
  }
}