import React, { Component } from 'react';

class CardHead extends Component {
  render() {
    return (
      <div className="Head">
        <div className="Date">
          <div className="Day">{ this.props.date.date() }</div>
          <div className="Month">{ this.props.date.format("MMM") }</div>
        </div>
        <h2>{ this.props.title }</h2>
      </div>
    )
  }
}

export default CardHead;