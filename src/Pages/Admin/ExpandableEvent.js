import moment from 'moment'
import React, { useState } from 'react'
import './ExpandableEvent.css'

import General from '../Historia/cards/General'
import Anniversary from '../Historia/cards/Anniversary'
import * as ROUTES from '../../routes'

// Expandable component, designed for the "Hantera händelser" page.
//Index is used for creating a unique id for each radio. Otherwise we will get multiple radios with
//the same id, which won't work
const ExpandableEvent = ({title, content, template, author, date, index, _id, accepted}) => {

    const [expanded, expand] = useState(false)
    const [checked, setChecked] = useState("")
    const [fetching, setFetching] = useState(false)
    const [locked, setLocked] = useState(false)
    const radios = ["Godkänn", "Avslå"]

    //TODO: Make component a pure view component. Will reuse component in a different place.

    //Called when pressing "Spara"
    //TODO: Move to mother component
    const save = _ => {
        setFetching(true)
        
        const body = JSON.stringify({
            id: _id,
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
            setLocked(true)
            console.log(res)
        })
        .catch(err => {
            setFetching(false)
        })
    }

    return (
        <div className="ExpandablEvent">
            <div className="row" onClick={_ => expand(!expanded)}>
                <div className="col">
                    <i className="fas fa-chevron-down" style={expanded ? {transform: "rotate(180deg)"} : {}}></i>
                </div>
                <div className="col title">
                    <b>{title}</b>
                </div>
                <div className="col">
                    {moment(author.date).format("YYYY-MM-DD hh:mm")}
                </div>
                <div className="col">
                    {author.user.first_name + " " + author.user.last_name}
                </div>
                <div className="col">
                    {template === "general" ? <span style={{color: "#ea4d8f", fontWeight: "bold"}}>Generell historia</span> : <span style={{color: "#E5C100", fontWeight: "bold"}}>Årsdagar</span>}
                </div>
                <div className="col">
                    {accepted.status === true ? (accepted.accepted ? <span style={{color: "green"}}><b>Godkänd</b></span> : <span style={{color: "red"}}><b>Avslagen</b></span> ) : "Ej behandlad"}
                    {/* {locked ? (checked === "Godkänn" ? <span style={{color: "green"}}>Godkänd</span> : <span style={{color: "red"}}>Avslagen</span>) : "Ej bedömd"} */}
                </div>
            </div>
            <div className="body" style={expanded ? {} : {display: "none"}}>
                <div className="bodyRow">
                    {radios.map((r,i) => 
                        <div className="radio" key={r}>
                            <input
                                // Id has to be unique, otherwise the radios won't work, hence the index + i
                                id={r + "-" + index + i}
                                type="radio" checked={checked === r}
                                onChange={e => setChecked(e.target.id.split("-")[0])}
                                disabled={locked}
                            />
                            <label htmlFor={r + "-" + index + i}>{r}</label>
                        </div>
                    )}
                    <button
                        onClick={save}
                        style={{backgroundColor: "#E5C100"}}
                        disabled={checked === "" || fetching || locked}
                    >
                        Spara
                    </button>                     
                </div>
                <div className="Timeline" ref={this.previewRef}>
                    <div key={'year-heading-' + 2020} id={'year-' + 2020}>
                        {/* <time className="Year">{ 2020 }</time> */}
                        <div className="cards">
                            {template === "general" &&
                                <General
                                    order={0}
                                    data={{
                                        title: title,
                                        content: content,
                                        date: moment(date)
                                    }}
                                />
                            }
                            {template === "anniversary" &&
                                <Anniversary
                                    order={0}
                                    data={{
                                        title: title,
                                        content: "",
                                        date: moment(date)
                                    }}
                                />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExpandableEvent