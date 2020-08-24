import React from 'react'
import { Redirect } from 'react-router-dom'
import * as ROUTES from '../../routes'

class Admin extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        console.log(this.props)
        if (this.props.admin && localStorage.getItem('token')) {
            return (
                <div>
                    Du är admin
                </div>
            )
        } else {
            return (<Redirect to={ROUTES.HOME} />)
        }
    }
}

export default Admin