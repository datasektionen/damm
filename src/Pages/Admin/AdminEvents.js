import React from 'react'
import UnhandledExpandableEvent from './UnhandledExpandableEvent'
import HandledExpandableEvent from './HandledExpandableEvent'

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
                    </div>
                </div>
            </div>
        )
    }
}

const TabBody = ({tabs, selectedTab, events}) => {
    if (selectedTab === tabs[0]) {
        if (events.filter(e => e.accepted.status === false).length === 0) {
            return <div>Inga obehandlade händelser</div>
        } else return (
            events.filter(e => e.accepted.status === false).map((e,i) => 
            <UnhandledExpandableEvent
                index={i}
                event={e}
            />
        ))
    } else if (selectedTab === tabs[1]) {
        return events.filter(e => e.accepted.status === true && e.accepted.accepted === true).map((e,i) => 
            // <ExpandableEvent {...e} index={i}/>
            <HandledExpandableEvent event={e} />
        )
    } else if (selectedTab === tabs[2]) {
        return events.filter(e => e.accepted.status === true && e.accepted.accepted === false).map((e,i) => 
            <HandledExpandableEvent event={e}/>    
        ) 
    } else return <div></div>
}

export default AdminEvents