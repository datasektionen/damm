import React, { Component } from 'react';
import CardHead from './CardHead'

class SM extends Component {
  render() {
    return (
      <div className="card" style={{'order': this.props.order}}>
        <div>
          <CardHead date={this.props.data.date} title={ this.props.data.name + ' hålls' } />
          <p>
            { this.props.data.name } hålls.&nbsp; 
            { this.props.data.protocol ? (<span>Protokollet finns tillgängligt <a href={this.props.data.protocol} target={'_blank'}>här</a>.</span>) : false }</p>
        </div>
      </div>
    )
  }
}

export default SM;