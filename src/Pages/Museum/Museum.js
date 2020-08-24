import React from 'react'
import logo from '../../skold.png'
import '../../App.css'

class Museum extends React.Component {
    constructor(props) {
        super(props)

    }

    render() {
        return (
            <div>
                <div className="Header">
                    <div>
                        <img src={logo} alt="Datasektionens sköld" className="Logo" />
                        <h1>Konglig Datasektionens</h1>
                        <h2>Historiska artefakter</h2>
                        <h4>(Eller andra coola föremål)</h4>
                    </div>
                </div>
                Douglas mamma<br/>Breznak
            </div>
        )
    }
}

export default Museum