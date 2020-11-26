import React, { useState } from 'react'
import moment from 'moment'
import * as ROUTES from '../../routes'

import ExpandableItem from '../../components/ExpandableItem'
import EventTimelineView from './components/EventTimelineView'

const HandledExpandableEvent = ({event, fetchEvents}) => {

    const [fetching, setFetching] = useState(false)
    const [edit, toggleEdit] = useState(false)
    const [title, setTitle] = useState(event.title)
    const [date, setDate] = useState(event.date)
    const [description, setDescription] = useState(event.content)

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

    const onSave = _ => {
        setFetching(true)

        const body = JSON.stringify({
            id: event._id,
            title,
            content: description,
            date
        })

        fetch(`${ROUTES.API_UPDATE_EVENT}?token=${localStorage.getItem('token')}`, {
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
                //Refetch events
                fetchEvents()
                .then(_ => {
                    toggleEdit(false)
                    reset()
                })
            }
        })
        .catch(err => {
            setFetching(false)
        })
    }

    const reset = _ => {
        setTitle(event.title)
        setDate(event.date)
        setDescription(event.content)
    }

    return (
        <ExpandableItem
            cols={[
                <b>{event.title}</b>,
                moment(event.accepted.date).format("YYYY-MM-DD kk:mm"),
                event.author.user.first_name + " " + event.author.user.last_name,
                event.template === "general" ? <span style={{color: "#ea4d8f", fontWeight: "bold"}}>Generell historia</span> : <span style={{color: "#E5C100", fontWeight: "bold"}}>Årsdagar</span>,
                event.accepted.status === true ? (event.accepted.accepted ? <span style={{color: "green"}}><b>Godkänd</b></span> : <span style={{color: "red"}}><b>Avslagen</b></span> ) : "Ej behandlad",
            ]}
        >
            {event.accepted.accepted === true &&
                <div>
                    <div>
                        Godkänd av {event.accepted.user.first_name + " " + event.accepted.user.last_name} den {moment(event.accepted.date).format("YYYY-MM-DD kk:mm")}
                    </div>
                    <div>
                        <button
                            style={{backgroundColor: "#E5C100"}}
                            onClick={_ => {
                                toggleEdit(!edit)
                                reset()
                            }}
                        >{edit ? "Avbryt" : "Redigera"}</button>
                        {!edit &&
                            <button
                                style={{backgroundColor: "#f44336", color: "white"}}
                                onClick={deleteEvent}
                                disabled={fetching}
                            >Ta bort</button>
                        }
                        {/* Code duplication <3 */}
                        {edit &&
                            <div className="Edit">
                                <input type="text" value={title} placeholder="Titel" onChange={e => setTitle(e.target.value)} />
                                <input type="date" value={date} onChange={e => setDate(e.target.value)} />
                                {event.template !== "anniversary" &&
                                    <textarea
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        placeholder="Beskrivning"
                                    />
                                }
                                <div>
                                    <button
                                        style={{width: "180px"}}
                                        onClick={reset}
                                    >Ångra ändringar</button>
                                    <button
                                        onClick={onSave}
                                        style={{backgroundColor: "#E5C100"}}
                                        disabled={fetching || (title === event.title && description === event.content && date === event.date)}
                                    >Spara</button>       
                                </div>
                            </div>
                        }
                    </div>
                </div>
            }
            {event.accepted.accepted === false &&
                <div>
                    <div>
                        Avslagen av {event.accepted.user.first_name + " " + event.accepted.user.last_name} den {moment(event.accepted.date).format("YYYY-MM-DD kk:mm:ss")}
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
            {edit ?
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
        </ExpandableItem>
    )
}

export default HandledExpandableEvent