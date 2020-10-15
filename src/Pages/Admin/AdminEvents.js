import React from 'react'
import moment from 'moment'
import ExpandableEvent from './ExpandableEvent'

import * as ROUTES from '../../routes'

class AdminEvents extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            events: [],
            tabs: ["Obehandlade", "Godkända", "Avslagna"],
            tab: "Obehandlade",
        }
    }

    componentDidMount() {
        fetch(ROUTES.API_GET_UNACCEPTED_EVENTS)
        .then(res => res.json())
        .then(json => {
            console.log(json.events)
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
                        <div className="tabs">
                            {this.state.tabs.map(tab =>
                                <div
                                    className={"tab" + (this.state.tab === tab ? " selected" : "")}
                                    onClick={() => this.setState({tab})}
                                >
                                    <h4>{tab}</h4>
                                </div>
                            )}
                        </div>
                        <TabBody tabs={this.state.tabs} selectedTab={this.state.tab} events={this.state.events} />
                        {/* {this.state.events.filter(e => e.accepted.status === false).map((e,i) => 
                            <ExpandableEvent {...e} index={i}/>    
                        )} */}
                    </div>
                </div>
            </div>
        )
    }
}

const TabBody = ({tabs, selectedTab, events}) => {
    if (selectedTab === tabs[0]) {
        return events.filter(e => e.accepted.status === false).map((e,i) => 
            <ExpandableEvent {...e} index={i}/>    
        )
    } else if (selectedTab === tabs[1]) {
        return events.filter(e => e.accepted.status === true && e.accepted.accepted === true).map((e,i) => 
            <ExpandableEvent {...e} index={i}/>    
        )
    } else if (selectedTab === tabs[2]) {
        return events.filter(e => e.accepted.status === true && e.accepted.accepted === false).map((e,i) => 
            <ExpandableEvent {...e} index={i}/>    
        ) 
    } else return <div></div>
}

export default AdminEvents