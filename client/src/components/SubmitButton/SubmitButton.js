import React from 'react'
import spinner from '../../res/spinner.svg'

const SubmitButton = ({text = "Spara", loadingText= "Sparar...", className="yellow", loading = false, ...rest}) => {

    return (
        <button {...rest} className={className}>
            {loading && <img src={spinner} style={{width: "20px"}}/> }
            {loading ? loadingText : text}
        </button>
    )
}

export default SubmitButton