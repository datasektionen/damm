import React from 'react'
import logo from '../../skold.png'
import '../../App.css'
import moment from 'moment'
import General from '../Historia/cards/General'

class Museum extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            artefakter: []
        }
    }

    componentDidMount() {
        fetch('/api/artefakter')
        .then(res => res.json())
        .then(json => {
            this.setState({artefakter: json})
        })
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
                <div style={{textAlign: "center", margin: "30px"}}>
                    <h3>Arbete pågår...</h3>
                </div>
                {/* <div className="Timeline">
                <div className="cards">
                    {this.state.artefakter.map((x,i) => <General data={{date: moment(x.date), title: x.name, content: x.description}} />)}
                </div>
                </div> */}
            </div>
        )
    }
}

export default Museum
