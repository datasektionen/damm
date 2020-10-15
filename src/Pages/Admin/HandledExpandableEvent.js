import React, { useState } from 'react'
import moment from 'moment'

import ExpandableEvent from './components/ExpandableEvent'
import EventTimelineView from './components/EventTimelineView'

const HandledExpandableEvent = ({event}) => {

    console.log(event)
    return (
        <ExpandableEvent
            cols={[
                <b>{event.title}</b>,
                moment(event.accepted.date).format("YYYY-MM-DD hh:mm:ss"),
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
                        <button style={{backgroundColor: "#f44336", color: "white"}}>Ta bort</button>
                    </div>
                </div>
            }
            {event.accepted.accepted === false &&
                <div>
                    Avslagen av {event.accepted.user.first_name + " " + event.accepted.user.last_name} den {moment(event.accepted.date).format("YYYY-MM-DD hh:mm:ss")}
                </div>
            }
            <EventTimelineView
                {...event}
            />
        </ExpandableEvent>
    )
}

export default HandledExpandableEvent