import React from 'react'
import { Link } from 'react-router-dom'
import * as ROUTES from '../../routes'
import './Admin.css'

const AdminCard = ({title, description, link, buttonText, onClick = () => {}}) => {

    return(
        <div className="AdminCard">
            <div className="Title">
                <h1>{title}</h1>
            </div>
            <div className="Description">
                {description}
            </div>
            {/* <div className="Button"> */}
                <Link onClick={() => onClick()} to={link}>{buttonText ? buttonText : "Kör"}</Link>
            {/* </div> */}
        </div>
    )
}

export default AdminCard