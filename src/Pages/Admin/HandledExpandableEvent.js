import React, { useState } from 'react'
import moment from 'moment'
import * as ROUTES from '../../routes'

import ExpandableEvent from './components/ExpandableEvent'
import EventTimelineView from './components/EventTimelineView'

const HandledExpandableEvent = ({event, fetchEvents}) => {

    const [fetching, setFetching] = useState(false)

    const deleteEvent = _ => {
        setFetching(true)

        fetch(`${ROUTES.API_DELETE_EVENT}?token=${localStorage.getItem('token')}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({id: event._id})
        })
        .then(res => res.json())
        .then(json => {
            setFetching(false)
            console.log(json)
            if (json.error) {
                
            } else {
                fetchEvents()
            }
        })
        .catch(err => {
            console.log(err)
            setFetching(false)
        })
    }

    return (
        <ExpandableEvent
            cols={[
                <b>{event.title}</b>,
                moment(event.accepted.date).format("YYYY-MM-DD kk:mm:ss"),
                event.author.user.first_name + " " + event.author.user.last_name,
                event.template === "general" ? <span style={{color: "#ea4d8f", fontWeight: "bold"}}>Generell historia</span> : <span style={{color: "#E5C100", fontWeight: "bold"}}>Årsdagar</span>,
                event.accepted.status === true ? (event.accepted.accepted ? <span style={{color: "green"}}><b>Godkänd</b></span> : <span style={{color: "red"}}><b>Avslagen</b></span> ) : "Ej behandlad",
            ]}
        >
            {event.accepted.accepted === true &&
                <div>
                    <div>
                        Godkänd av {event.accepted.user.first_name + " " + event.accepted.user.last_name} den {moment(event.accepted.date).format("YYYY-MM-DD hh:mm:ss")}
                    </div>
                    <div>
                        <button style={{backgroundColor: "#E5C100"}}>Redigera</button>
                        <button
                            style={{backgroundColor: "#f44336", color: "white"}}
                            onClick={deleteEvent}
                            disabled={fetching}
                        >Ta bort</button>
                    </div>
                </div>
            }
            {event.accepted.accepted === false &&
                <div>
                    <div>
                        Avslagen av {event.accepted.user.first_name + " " + event.accepted.user.last_name} den {moment(event.accepted.date).format("YYYY-MM-DD hh:mm:ss")}
                    </div>
                    {event.accepted.comment &&
                        <div>
                            Kommentar: {event.accepted.comment}
                        </div>
                    }
                    <button
                        style={{backgroundColor: "#f44336", color: "white"}}
                        onClick={deleteEvent}
                        disabled={fetching}
                    >Ta bort</button>
                </div>
            }
            <EventTimelineView
                {...event}
            />
        </ExpandableEvent>
    )
}

export default HandledExpandableEvent