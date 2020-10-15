import React, { useState } from 'react'
import './ExpandableEvent.css'

// Expandable component, designed for the "Hantera händelser" page.
//Index is used for creating a unique id for each radio. Otherwise we will get multiple radios with
//the same id, which won't work
const ExpandableEvent = ({cols = [], children}) => {

    const [expanded, expand] = useState(false)

    return (
        <div className="ExpandablEvent">
            <div className="row" onClick={_ => expand(!expanded)}>
                <div className="col">
                    <i className="fas fa-chevron-down" style={expanded ? {transform: "rotate(180deg)"} : {}}></i>
                </div>
                {cols.map((col,i) =>
                    <div className={i === 0 ? "col title" : "col"} key={i}>
                        {col}
                    </div>
                )}
            </div>
            <div className="body" style={expanded ? {} : {display: "none"}}>
                {children}
            </div>
        </div>
    )
}

export default ExpandableEvent