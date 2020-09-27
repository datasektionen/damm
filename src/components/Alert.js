import React from 'react'
import './Alert.css'

const Alert = ({type = "success", ...props}) => {
    return (
        <div className={"AlertComponent " + type}>
            {props.children}
        </div>
    )
}

export default Alert