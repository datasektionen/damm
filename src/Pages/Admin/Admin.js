import React from 'react'

class Admin extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        console.log(this.props)
        if (this.props.isAdmin && this.props.token) {
            return (
                <div>
                    Du är admin
                </div>
            )
        } else {
            return (
                <div>
                    Du är inte admin
                </div>
            )
        }
    }
}

export default Admin