import React, { useState } from 'react'

import Add from './add.png'
import Added from './added.png'

const TagClickable = ({color = "#fff", backgroundColor = "#e83d84", text = "", hoverText = "", selectedTags, onClick}) => {

    const clicked = selectedTags.filter(x => x.text === text).length > 0 ? true : false
    // const clicked = selectedTags.includes(text)

    return (
        <div className="tagClickable" title={hoverText === "" ? "Ingen beskrivning" : hoverText} onClick={() => onClick()} style={clicked ? {backgroundColor, color} : {}} >
            <span>{text}</span>
            <img src={clicked ? Added : Add} />
        </div>
    )
}


export default TagClickable