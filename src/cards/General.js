import React, { Component } from 'react';
import CardHead from './CardHead'
import MDReactComponent from 'markdown-react-js'

class General extends Component {
  render() {
    return (
      <div key={'card-' + this.props.data.date.year() + '-' + this.props.order} className="card" style={{'order': this.props.order}}>
        <div>
          <CardHead date={this.props.data.date} title={this.props.data.title} />
          <MDReactComponent text={this.props.data.content} />
        </div>
      </div>
    )
  }
}

export default General;