import React from 'react'

import Add from './add.png'
import Added from './added.png'
import './TagClickable.css'

const TagClickable = ({color = "#fff", backgroundColor = "#e83d84", text = "", hoverText = "", selectedTags=[], onClick}) => {

    const clicked = selectedTags.filter(x => x.text === text).length > 0 ? true : false
    // const clicked = selectedTags.includes(text)

    return (
        <div className="tagClickable" title={hoverText === "" ? "Ingen beskrivning" : hoverText} onClick={() => onClick()} style={clicked ? {backgroundColor: backgroundColor === "" ? "#e83d84" : backgroundColor, color: color === "" ? "#fff" : color} : {}} >
            <span>{text}</span>
            <img alt="" src={clicked ? Added : Add} />
        </div>
    )
}


export default TagClickable