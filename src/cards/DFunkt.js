import React, { Component } from 'react';
import CardHead from './CardHead'

class DFunkt extends Component {
  render() {
    return (
      <div key={'card-' + this.props.data.date.year() + '-' + this.props.order} className="card" style={{'order': this.props.order}}>
        <div>
          <CardHead date={this.props.data.date} title="Nya funktionärer" />
          { true ?
          (
          <div className="users">
            { this.props.data.mandates.map((x) => (
              <div title={x.user.first_name + " " + x.user.last_name} key={'mandate-pic-' + x.user.kthid + '-' + x.role.identifier + '-' + this.props.data.date} className="crop" style={{backgroundImage: 'url(https://zfinger.datasektionen.se/user/' + x.user.kthid + '/image/200)'}} />
            )) }
          </div>
          ) : false }
          { this.props.data.mandates.length > 1 ?
            (
              <div>
                <p>På denna dag fick { this.props.data.mandates.length } poster nya funktionärer.</p>
                <ul>
                { this.props.data.mandates.map(mandate => (
                  <li key={'mandate-' + mandate.user.kthid + '-' + mandate.role.identifier + '-' + this.props.data.date}>
                    { mandate.user.first_name } { mandate.user.last_name } tillträdde som { mandate.role.title }
                  </li>
                )) }
                </ul>
              </div>
            )
            :
            (
              <p>På denna dag tillträdde { this.props.data.mandates[0].user.first_name } { this.props.data.mandates[0].user.last_name } som { this.props.data.mandates[0].role.title }</p>
            )
          }
        </div>
      </div>
    )
  }
}

export default DFunkt;