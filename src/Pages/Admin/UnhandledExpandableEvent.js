import React, { useState } from 'react'
import moment from 'moment'

import * as ROUTES from '../../routes'
import ExpandableEvent from './components/ExpandableEvent'
import EventTimelineView from './components/EventTimelineView'

const UnhandledExpandableEvent = ({event, index, fetchEvents}) => {
    const [checked, setChecked] = useState("")
    const [fetching, setFetching] = useState(false)
    const [locked, setLocked] = useState(false)
    const radios = ["Godkänn", "Avslå"]

    const onSave = _ => {
        setFetching(true)
        
        const body = JSON.stringify({
            id: event._id,
            accept: checked === "Godkänn"
        })

        fetch(`${ROUTES.API_ACCEPT_EVENT}?token=${localStorage.getItem('token')}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body
        })
        .then(res => res.json())
        .then(res => {
            setFetching(false)
            if (res.error) {
                // Caught by catch block?
            } else {
                setLocked(true)
                //Refetch events
                fetchEvents()
            }
        })
        .catch(err => {
            setFetching(false)
        })
    }

    return (
        <ExpandableEvent
            cols={[
                <b>{event.title}</b>,
                moment(event.author.date).format("YYYY-MM-DD hh:mm"),
                event.author.user.first_name + " " + event.author.user.last_name,
                event.template === "general" ? <span style={{color: "#ea4d8f", fontWeight: "bold"}}>Generell historia</span> : <span style={{color: "#E5C100", fontWeight: "bold"}}>Årsdagar</span>,
                //TODO: Change to just "Ej behandlad", "Behandlas" and then nothing since it will be updated.
                event.accepted.status === true ? (event.accepted.accepted ? <span style={{color: "green"}}><b>Godkänd</b></span> : <span style={{color: "red"}}><b>Avslagen</b></span> ) : "Ej behandlad"
            ]}
        >
            <div className="bodyRow">
                {radios.map((r,i) => 
                    <div className="radio" key={r}>
                        <input
                            // Id has to be unique, otherwise the radios won't work, hence the index + i
                            id={r + "-" + index + i}
                            type="radio"
                            checked={checked === r}
                            onChange={e => setChecked(e.target.id.split("-")[0])}
                            disabled={locked}
                        />
                        <label htmlFor={r + "-" + index + i}>{r}</label>
                    </div>
                )}
                <button
                    onClick={onSave}
                    style={{backgroundColor: "#E5C100"}}
                    disabled={checked === "" || fetching || locked}
                >
                    Spara
                </button>                     
            </div>
            <EventTimelineView
                {...event}
            />
        </ExpandableEvent>
    )
}

export default UnhandledExpandableEvent