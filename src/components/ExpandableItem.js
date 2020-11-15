import React, { useState } from 'react'
import './ExpandableItem.css'

// Expandable component, designed for the "Hantera händelser" page.
const ExpandableItem = ({cols = [], children}) => {

    const [expanded, expand] = useState(false)

    return (
        <div className="ExpandableItem">
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

export default ExpandableItem