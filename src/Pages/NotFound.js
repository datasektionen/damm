import React from 'react'
import {Link} from 'react-router-dom'
import * as ROUTES from '../routes'

const NotFound = () => (
    <div className="Admin">
        <div className="Header">
        <div><h2>404 Not Found</h2></div>
        </div>
        <div style={{textAlign: "center", padding: "50px"}}>
            Sidan hittades ej :(
            <p><Link to={ROUTES.HOME}>Hem</Link></p>
        </div>
    </div>
)

export default NotFound