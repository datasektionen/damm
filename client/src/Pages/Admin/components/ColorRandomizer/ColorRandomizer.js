import React from 'react'

const ColorRandomizer = ({bgColor = "#ffffff", color = "#000000", ...rest}) => {
    return (
        <span {...rest} style={{backgroundColor: bgColor, color, width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "25%", cursor: "pointer", fontSize: "1.3em", border: "solid 1px black"}}>
            <i class="fas fa-recycle"></i>
        </span>
    )
}

export default ColorRandomizer