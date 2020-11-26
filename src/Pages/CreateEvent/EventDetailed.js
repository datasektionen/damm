import React, { useState } from 'react'
import './EventDetailed.css'
import moment from 'moment'

import EventTimelineView from '../Admin/components/EventTimelineView'
import Alert from '../../components/Alert'
import { EVENT_TYPE_TO_STRING, EVENT_TYPES } from '../../config/constants'
import * as ROUTES from '../../routes'

const EventDetailed = ({data, ...rest}) => {
    console.log(data)
    console.log(rest)
    const [localTitle, setLocalTitle] = useState(data.title)
    const [localContent, setLocalContent] = useState(data.content)
    const [localDate, setLocalDate] = useState(data.date)
    const [alert, setAlert] = useState({})

    const onFetch = response => {
        setAlert(response)
        rest.fetchData()
    }

    return (
        <div className="EventDetailed">
            <div className="HeaderBar">
                <h2>{data.title}</h2>
            </div>
            <div className="EventDetailedContent">
                <div className="EventDetailedBox">
                    {alert.error && <Alert type="error">{alert.error}</Alert>}
                    {alert.status && <Alert type="success">{alert.status}</Alert>}
                    <div className="row layout">
                        <div className="col layout">
                            <h2 id="title">Information</h2>
                            <Table data={data} />
                        </div>
                        <div className="col layout">
                            <h2 id="title">Redigera</h2>
                            <h4>Titel</h4>
                            <input
                                type="text"
                                placeholder="Titel"
                                value={localTitle}
                                onChange={e => setLocalTitle(e.target.value)}
                                // Disable when denied
                                disabled={data.accepted.accepted === false}
                            />
                            {/* Don't display description when event is anniversary */}
                            {data.template === EVENT_TYPES.GENERAL &&
                                <div>
                                    <h4>Beskrivning</h4>
                                    <textarea
                                        placeholder="Beskrivning"
                                        value={localContent}
                                        onChange={e => setLocalContent(e.target.value)}
                                        // Disable when denied
                                        disabled={data.accepted.accepted === false}
                                    />
                                </div>
                            }
                            <h4>Datum</h4>
                            <input
                                type="date"
                                value={localDate}
                                onChange={e => setLocalDate(e.target.value)}
                                // Disable when denied
                                disabled={data.accepted.accepted === false}
                            />
                            <div>
                                <RenderButtons
                                    data={data}
                                    local={{title: localTitle, content: localContent, date: localDate}}
                                    onFetch={response => onFetch(response)}
                                    history={rest.history}
                                />
                            </div>
                        </div>

                    </div>
                    <div className="timeline">
                        <h2 id="title">Förhandsgranskning</h2>
                        <EventTimelineView {...data} />
                    </div>
                </div>
            </div>
        </div>
    )
}

const Table = ({data}) => {
    const user = data.author.user
    const date = data.author.date
    const accepted = data.accepted

    return (
        <table>
            <tbody>
                <tr>
                    <th>Händelse-id:</th>
                    <td>{data._id}</td>
                </tr>
                <tr>
                    <th>Skapat av:</th>
                    <td>{user.first_name} {user.last_name} (<a href={"mailto:" + user.email} target="_blank" rel="noopener noreferrer">{user.email}</a>)</td>
                </tr>
                <tr>
                    <th>Skapat den:</th>
                    <td>{moment(date).format("YYYY-MM-DD kk:mm")}</td>
                </tr>
                <tr>
                    <th>Titel:</th>
                    <td>{data.title}</td>
                </tr>
                <tr>
                    <th>Datum för händelse:</th>
                    <td>{data.date}</td>
                </tr>
                <tr>
                    <th>Händelsetyp:</th>
                    <td>{EVENT_TYPE_TO_STRING[data.template]}</td>
                </tr>
                <tr>
                    <th>Kommentar:</th>
                    <td>{data.comment}</td>
                </tr>
                <tr>
                    <th>Status:</th>
                    <td>{accepted.status === false ? "Ej behandlad" : (accepted.accepted ? "Godkänd" : "Avslagen")}</td>
                </tr>
                {accepted.status === true &&
                <tr>
                    <th>Godkänd av:</th>
                    <td>{accepted.user.first_name} {accepted.user.last_name} ({moment(accepted.date).format("YYYY-MM-DD kk:mm")})</td>
                </tr>
                }
            </tbody>
        </table>
    )
}

const RenderButtons = ({data, local, onFetch, history}) => {
    const accepted = data.accepted

    const [fetching, setFetching] = useState(false)

    const fetchAcceptDenyEdit = (accept = true, edit = false) => {
        setFetching(true)

        let body = {
            id: data._id,
            accept,
            changes: {}
        }

        // Only apply edits to event if we are going to accept it
        if (accept) {
            let values = ["title", "content", "date"]
            
            // Apply changes
            values.map(x => {
                // if local changes isn't equal to data on the server, append to body
                if (local[x] !== data[x]) body["changes"][x] = local[x]
            })
        }

        let URL
        if (!edit) URL = `${ROUTES.API_HANDLE_EVENT}?token=${localStorage.getItem("token")}`
        else URL = `${ROUTES.API_UPDATE_EVENT}?token=${localStorage.getItem("token")}`
        
        fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        .then(res => res.json())
        .then(json => {
            setFetching(false)
            onFetch(json)
            console.log(json)
        })
        .catch(err => {
            setFetching(false)
            onFetch(err)
            console.log(err)
        })
    }

    const fetchDelete = _ => {
        setFetching(true)
        fetch(`${ROUTES.API_DELETE_EVENT}?token=${localStorage.getItem("token")}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id: data._id})
        })
        .then(res => res.json())
        .then(json => {
            setFetching(false)
            console.log(json)
            history.push(ROUTES.ADMIN, json)
        })
        .catch(err => {
            console.log(err)
            // onFetch(err)
            setFetching(false)
        })
    }

    if (accepted.status === false) return (
        <div className="buttons">
            <button
                className="green"
                disabled={fetching}
                onClick={_ => fetchAcceptDenyEdit(true)}
            >Godkänn</button>
            <button
                className="red"
                disabled={fetching}
                onClick={_ => fetchAcceptDenyEdit(false)}
            >Avslå</button>
        </div>
    )
    if (accepted.status === true) {
        if (accepted.accepted === true) return (
            // Händelsen är godkänd
            <div className="buttons">
                <button
                    className="yellow"
                    disabled={fetching || (data.title === local.title && data.content === local.content && local.date === data.date)}
                    onClick={_ => fetchAcceptDenyEdit(true, true)}
                >Spara</button>
                <button
                    className="red"
                    disabled={fetching}
                    onClick={_ => {
                        if (window.confirm("Är du verkligen säker på att du vill ta bort händelsen? Den går att redigera om du istället vill göra mindre ändringar.")) {
                            fetchDelete()
                        }
                }}>Ta bort</button>
            </div>

        )
        if (accepted.accepted === false) return (
            // Händelsen är avslagen
            <div className="buttons">
                <p>Avslagna händelser tas automatiskt bort efter en timme.</p>
            </div>
        )
    }
    return <div></div>
}

export default EventDetailed