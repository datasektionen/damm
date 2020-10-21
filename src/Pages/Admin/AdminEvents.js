import React from 'react'
import UnhandledExpandableEvent from './UnhandledExpandableEvent'
import HandledExpandableEvent from './HandledExpandableEvent'

import * as ROUTES from '../../routes'
import Add from '../../components/add.png'
import moment from 'moment'

class AdminEvents extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            events: [],
            tabs: ["Obehandlade", "Godkända", "Avslagna"],
            tab: "Obehandlade",
            query: "",
            templateFilter: "all"
        }

        this.fetchEvents = this.fetchEvents.bind(this)
    }

    //Get all events
    componentDidMount() {
        this.fetchEvents()
    }

    fetchEvents() {
        return new Promise((resolve, reject) => {
            fetch(ROUTES.API_GET_UNACCEPTED_EVENTS)
            .then(res => res.json())
            .then(json => {
                console.log(json.events)
                this.setState({events: json.events})
                resolve()
            })
            .catch(err => {
                reject()
            })
        })
    }

    render() {

        //Handles query serach state change
        const handleQuery = e => {
            this.setState({query: e.target.value})
        }

        //Dropdown options for the template filter selection.
        const filterOptions = [
            {text: "Filter: Inga", value: "all"},
            {text: "Generell historia", value: "general"},
            {text: "Årsdagar", value: "anniversary"}
        ]

        return (
            <div className="Admin">
                <div className="Header">
                    <div><h2>Hantera händelser</h2></div>
                </div>
                <div className="Body">
                    <div className="Box">
                        <div className="Filter">
                            <input
                                type="text"
                                value={this.state.query}
                                placeholder="Sök titel, innehåll eller år"
                                onChange={handleQuery}
                            />
                            <img alt="Kryss" className="clearImg" src={Add} onClick={() => {this.setState({query: ""})}}/>
                            <select value={this.state.templateFilter} onChange={e => this.setState({templateFilter: e.target.value})}>
                                {filterOptions.map((option,i) =>
                                    <option key={i} value={option.value}>{option.text}</option>
                                )}
                            </select>
                            <button style={{backgroundColor: "#E5C100"}} onClick={_ => this.setState({query: "", templateFilter: "all"})}>Rensa filter</button>
                        </div>
                        <div className="tabs">
                            {this.state.tabs.map(tab =>
                                <div
                                    key={tab}
                                    className={"tab" + (this.state.tab === tab ? " selected" : "")}
                                    onClick={() => this.setState({tab})}
                                >
                                    <h4>{tab}</h4>
                                </div>
                            )}
                        </div>
                        <TabBody
                            tabs={this.state.tabs}
                            selectedTab={this.state.tab}
                            events={this.state.events}
                            query={this.state.query}
                            templateFilter={this.state.templateFilter}
                            fetchEvents={this.fetchEvents}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

//Handles what to render on each tab, filters events based on search query and selected filter
const TabBody = ({tabs, selectedTab, events, query, templateFilter, fetchEvents}) => {
    //Filter by selected templates (dropdown)
    const filteredByTemplateEvents = templateFilter === "all" ? events : events.filter(e => e.template === templateFilter)

    //Filter by search query, matches title, content and year with regex
    const queryFilteredEvents = filteredByTemplateEvents.filter(e =>
        e.title.toLowerCase().match(new RegExp(query.toLowerCase(), "g"))
        || e.content.toLowerCase().match(new RegExp(query.toLowerCase(), "g"))
        || moment(e.date).format("YYYY").match(new RegExp(query.toLowerCase(), "g"))
    )

    if (selectedTab === tabs[0]) {
        if (queryFilteredEvents.filter(e => e.accepted.status === false).length === 0) {
            return <div>Inga obehandlade händelser</div>
        } else return (
            queryFilteredEvents.filter(e => e.accepted.status === false).map((e,i) => 
            <UnhandledExpandableEvent
                index={i}
                event={e}
                fetchEvents={fetchEvents}
                key={e._id}
            />
        ))
    } else if (selectedTab === tabs[1]) {
        if (queryFilteredEvents.filter(e => e.accepted.status === true && e.accepted.accepted === true).length === 0) {
            return <div>Inga godkända händelser</div>
        } else return queryFilteredEvents.filter(e => e.accepted.status === true && e.accepted.accepted === true).map((e,i) => 
            <HandledExpandableEvent event={e} key={e._id} fetchEvents={fetchEvents} />
        )
    } else if (selectedTab === tabs[2]) {
        if (queryFilteredEvents.filter(e => e.accepted.status === true && e.accepted.accepted === false).length === 0) {
            return <div>Inga avslagna händelser</div>
        } else return queryFilteredEvents.filter(e => e.accepted.status === true && e.accepted.accepted === false).map((e,i) => 
            <HandledExpandableEvent event={e} key={e._id} fetchEvents={fetchEvents} />    
        ) 
    } else return <div></div>
}

export default AdminEvents