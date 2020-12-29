import React from 'react'
import Add from '../add.png'
import './Input.css'

const Input = ({clear, ...rest}) => {
    return (
        <div className="InputComponent">
            <input type="text" {...rest} />
            <img
                    id="clear"
                    alt="Kryss"
                    src={Add}
                    onClick={clear}
                    draggable="false"
            />
        </div>
    )
}

export default Input