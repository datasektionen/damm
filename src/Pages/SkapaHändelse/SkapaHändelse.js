import React from 'react'
import {Redirect} from 'react-router-dom'
import * as ROUTES from '../../routes'

class SkapaHändelse extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            checked: ""
        }
    }

    render() {
        console.log(this.props)

        const radios = ["Generell historia", "SM och DM", "Årsdagar"]

        const handleRadioChange = e => {
            this.setState({checked: e.target.id})
        }

        if (localStorage.getItem('token')) {
            return (
                <div>
                    <input type="text" placeholder="Titel" />
                    <textarea placeholder="Beskrivning" />
                    <input type="date" />
                    {radios.map(x => 
                        <div className="radio">
                            <input id={x} type="radio" checked={this.state.checked === x} onChange={e => handleRadioChange(e)}/>
                            <label htmlFor={x}>{x}</label>
                        </div>   
                    )}
                    <button>Skapa händelseförslag</button>
                </div>
            )
        } else {
            return (
                <Redirect to={ROUTES.LOGIN} />
            )
        }
    }
}

export default SkapaHändelse