import React from 'react'
import {Link} from 'react-router-dom'
import * as ROUTES from '../routes'

const InternalError = () => (
    <div className="Admin">
        <div className="Header">
        <div><h2>500 Internal Server Error</h2></div>
        </div>
        <div style={{textAlign: "center", padding: "50px"}}>
            <h3><b>Det här gick ju inte så bra...</b></h3>
            <h4 style={{paddingTop: "20px"}}>
                Något gick fel. Försök igen, om du misstänker att något är fel kontakta <a href="#" target="_blank" rel="noopener noreferrer">sidaministratörer</a>, <a href="https://ior.slack.com" target="_blank" rel="noopener noreferrer">IOR</a> eller <a href="https://github.com/datasektionen/damm/issues/new" target="_blank" rel="noopener noreferrer">skapa en issue på github</a>.
            </h4>
            <p><Link to={ROUTES.HOME}>Hem</Link></p>
        </div>
    </div>
)

export default InternalError