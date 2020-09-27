import React from 'react'

const Tag = ({color = "#fff", backgroundColor = "#e83d84", text = "", hoverText="text"}) => {
    return (
        <div className="tag" title={hoverText === "" ? "Ingen beskrivning" : hoverText} style={{backgroundColor: backgroundColor === "" ? "#e83d84" : backgroundColor, color: color === "" ? "#000" : color}}>
            {text}
        </div>
    )
}


export default Tag