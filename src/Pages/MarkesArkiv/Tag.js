import React from 'react'

const Tag = ({color = "#fff", backgroundColor = "#008672", text = "", hoverText=text}) => {
    return (
        <div className="tag" title={hoverText} style={{color: color, backgroundColor: backgroundColor}}>
            {text}
        </div>
    )
}


export default Tag