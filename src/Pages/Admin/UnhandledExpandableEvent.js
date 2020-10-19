import React, { useState } from 'react'
import moment from 'moment'

import * as ROUTES from '../../routes'
import ExpandableEvent from './components/ExpandableEvent'
import EventTimelineView from './components/EventTimelineView'

const UnhandledExpandableEvent = ({event, index, fetchEvents}) => {
    const [checked, setChecked] = useState("")
    const [fetching, setFetching] = useState(false)
    const [locked, setLocked] = useState(false)
    
    const [title, setTitle] = useState(event.title)
    const [date, setDate] = useState(event.date)
    const [description, setDescription] = useState(event.content)
    
    const [comment, setComment] = useState("")

    const radios = [
        {text: "Godkänn", value: "godkänn"},
        {text: "Avslå", value: "avslå"},
        {text: "Godkänn med ändring", value: "godkännmedändring"}
    ]

    const onSave = _ => {
        setFetching(true)

        // Append changes to event, if there are any
        let changes = {}
        if (checked === "godkännmedändring") {
            if (title !== event.title) changes["title"] = title
            if (description !== event.content) changes["content"] = description
            if (date !== event.date) changes["date"] = date
        }

        const body = JSON.stringify({
            id: event._id,
            accept: checked,
            comment,
            changes
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
                moment(event.author.date).format("YYYY-MM-DD kk:mm"),
                event.author.user.first_name + " " + event.author.user.last_name,
                event.template === "general" ? <span style={{color: "#ea4d8f", fontWeight: "bold"}}>Generell historia</span> : <span style={{color: "#E5C100", fontWeight: "bold"}}>Årsdagar</span>,
                //TODO: Change to just "Ej behandlad", "Behandlas" and then nothing since it will be updated.
                event.accepted.status === true ? (event.accepted.accepted ? <span style={{color: "green"}}><b>Godkänd</b></span> : <span style={{color: "red"}}><b>Avslagen</b></span> ) : "Ej behandlad"
            ]}
        >
            <div className="bodyRow">
                <div>
                    <span><b>Kommentar:</b> </span>
                    {event.comment}
                </div>
                {radios.map((r,i) => 
                    <div className="radio" key={r.value}>
                        <input
                            // Id has to be unique, otherwise the radios won't work, hence the index + i
                            id={r.value + "-" + index + i}
                            type="radio"
                            checked={checked === r.value}
                            onChange={e => setChecked(e.target.id.split("-")[0])}
                            disabled={locked}
                        />
                        <label htmlFor={r.value + "-" + index + i}>{r.text}</label>
                    </div>
                )}
                {checked === "avslå" &&
                    <textarea placeholder="Kommentar" value={comment} onChange={e => setComment(e.target.value)} />
                }
                {/* If we checked to approve with changes */}
                {checked === "godkännmedändring" &&
                    <div className="ApproveWithChanges">
                        <input type="text" value={title} placeholder="Titel" onChange={e => setTitle(e.target.value)} />
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
                        {event.template !== "anniversary" &&
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Beskrivning"
                            />
                        }
                        <button
                            style={{width: "180px"}}
                            onClick={_ => {
                                setTitle(event.title)
                                setDate(event.date)
                                setDescription(event.content)
                            }}
                        >Ångra ändringar</button>
                    </div>
                }
                {/* Save button */}
                <button
                    onClick={onSave}
                    style={{backgroundColor: "#E5C100"}}
                    disabled={
                        checked === ""
                        || fetching
                        || locked
                        ||
                        (
                            checked === "godkännmedändring"
                            && title === event.title
                            && description === event.content
                            && date === event.date
                        )
                    }
                >
                    Spara
                </button>                     
            </div>
            {/* Preview the local changes if we checked that radio, else render the original */}
            {checked === "godkännmedändring" ? 
                <EventTimelineView
                    title={title}
                    content={description}
                    date={date}
                    template={event.template}
                />
                :
                <EventTimelineView
                    {...event}
                />      
            }
        </ExpandableEvent>
    )
}

export default UnhandledExpandableEvent