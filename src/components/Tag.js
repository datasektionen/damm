import React from 'react'
import './Tag.css'
const Tag = ({color = "#fff", backgroundColor = "#e83d84", text = "", hoverText="text"}) => {
    return (
        <div
            className="TagComponent"
            title={hoverText === "" ? "Ingen beskrivning" : hoverText}
            style={{
                backgroundColor: backgroundColor === "" ? "#e83d84" : backgroundColor, color: color === "" ? "#fff" : color
            }}
        >
            {text}
        </div>
    )
}


export default Tag