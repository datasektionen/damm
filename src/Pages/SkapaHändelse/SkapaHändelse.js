import React from 'react'
import {Redirect} from 'react-router-dom'

class SkapaHändelse extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        console.log(this.props)
        if (localStorage.getItem('token')) {
            return (
                <div>
                    Här kan du lägga till en händelse som du tycker borde komma till historien.
                </div>
            )
        } else {
            return (
                <Redirect to="/login" />
            )
        }
    }
}

export default SkapaHändelse