import React from 'react'
import moment from 'moment'
import ExpandableEvent from './ExpandableEvent'

import * as ROUTES from '../../routes'

class AdminEvents extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            events: []
        }
    }

    componentDidMount() {
        fetch(ROUTES.API_GET_UNACCEPTED_EVENTS)
        .then(res => res.json())
        .then(json => {
            this.setState({events: json.events})
        })
        .catch(err => {

        })
    }

    render() {
        return (
            <div className="Admin">
                <div className="Header">
                    <div><h2>Hantera händelser</h2></div>
                </div>
                <div className="Body">
                    <div className="Box">
                        <h1>Väntande händelser</h1>
                        {/* <table className="table">
                            <thead>
                            <tr>
                                <th>Datum</th>
                                <th>Användare</th>
                                <th>Titel</th>
                                <th>Typ</th>
                                <th>Handling</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.events.filter(e => e.accepted.status === false).map(e =>
                                <tr>
                                    <td>{moment(e.author.date).format("YYYY-MM-DD HH:MM")}</td>
                                    <td>{e.author.user.first_name + " " + e.author.user.last_name}</td>
                                    <td>{e.title}</td>
                                    <td>{e.template}</td>
                                    <td>
                                        <div className="radio">
                                            <input id="godkänn" type="radio" checked={false} onChange={e => {}}/>
                                            <label htmlFor="godkänn">Godkänn</label>
                                        </div>
                                        <div className="radio">
                                            <input id="avslå" type="radio" checked={true} onChange={e => {}}/>
                                            <label htmlFor="avslå">Avslå</label>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table> */}
                        {this.state.events.filter(e => e.accepted.status === false).map(e => 
                            <ExpandableEvent {...e} />    
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default AdminEvents