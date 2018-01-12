import React, { Component } from 'react';
import CardHead from './CardHead'
import MDReactComponent from 'markdown-react-js'

class Anniversary extends Component {
  render() {
    const month = {
      1: 'januari', 2: 'februari', 3: 'mars', 4: 'april', 5: 'maj', 6: 'juni', 7: 'juli', 8: 'augusti', 9: 'september', 10: 'oktober', 11: 'november', 12: 'december'
    }
    return (
      <div key={'card-' + this.props.data.date.year() + '-' + this.props.order} className="card Anniversary" style={{'order': this.props.order}}>
        <div>
          <div className="Head">
            <h2>{ this.props.data.title }</h2>
          </div>
          <time>{ this.props.data.date.format('D') } { month[this.props.data.date.format('M')] } { this.props.data.date.format('YYYY') }</time>
          <i className="fa fa-star"></i>
        </div>
      </div>
    )
  }
}

export default Anniversary;