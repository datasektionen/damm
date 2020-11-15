import React from 'react'
import './EventDetailed.css'
import moment from 'moment'

import EventTimelineView from '../Admin/components/EventTimelineView'
import ExpandableItem from '../../components/ExpandableItem'
import Alert from '../../components/Alert'

const EventDetailed = ({data, ...rest}) => {
    console.log(data)
    const original = data
    let local = Object.assign(data)

    const user = data.author.user
    const date = data.author.date
    const accepted = data.accepted

    return (
        <div className="EventDetailed">
            <div className="HeaderBar">
                <h2>{data.title}</h2>
            </div>
            <div className="EventDetailedContent">
                <div className="EventDetailedBox">
                    <Alert>

                    </Alert>
                    <h2 id="title">Information</h2>
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
                    <h2 id="title">Förhandsgranskning</h2>
                    <ExpandableItem cols={[<b>Förhandsgranskning</b>]} startOpen={true}>
                        <EventTimelineView {...data} />
                    </ExpandableItem>

                    {accepted.accepted !== false &&
                        <div>
                            <h2 id="title">Redigera</h2>
                            <ExpandableItem cols={[<b>Redigera</b>]}>
                                <div className="Edit">
                                    <input
                                        type="text"
                                        placeholder="Titel"
                                        value={data.title}
                                    />
                                    <textarea
                                        placeholder="Beskrivning"
                                        value={data.description}
                                    />
                                    <input
                                        type="date"
                                        value={data.date}
                                    />
                                </div>
                            </ExpandableItem>
                        </div>
                    }

                    {/* Ej ännu behandlad*/}
                    {accepted.status === false &&
                        <div>
                            <button className="green">Godkänn</button>
                            <button className="red">Avslå</button>
                        </div>
                    }
                    {/* Behandlad */}
                    {accepted.status === true &&
                        (accepted.accepted === true ?
                            // Händelsen är godkänd
                            <div>
                                <button className="yellow">Spara</button>
                                <button
                                    className="red"
                                    onClick={_ => {
                                        if (window.confirm("Är du verkligen säker på att du vill ta bort händelsen? Den går att redigera om du istället vill göra mindre ändringar.")) {
                                            // Do stuff
                                        }
                                }}>Ta bort</button>
                            </div>
                            :
                            // Händelsen är avslagen
                            <div>
                                <p>Avslagna händelser tas automatiskt bort efter 24 timmar.</p>
                                <button className="yellow">Ta bort</button>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default EventDetailed