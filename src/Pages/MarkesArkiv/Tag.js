import React from 'react'

const Tag = ({color = "#fff", backgroundColor = "#e83d84", text = "", hoverText="text"}) => {
    return (
        <div className="tag" title={hoverText === "" ? "Ingen beskrivning" : hoverText} style={{color: color, backgroundColor: backgroundColor}}>
            {text}
        </div>
    )
}


export default Tag