import React from 'react'
import {Redirect} from 'react-router-dom'
import * as ROUTES from '../../routes'
import './SkapaHändelse.css'
import Alert from '../../components/Alert'

const INITIAL_STATE = {
    title: "",
    description: "",
    date: "",
    checked: "",
    fetching: false,
}

const SUCCESS_STATE = {
    ...INITIAL_STATE,
    success: true,
    error: ""
}

class SkapaHändelse extends React.Component {
    constructor(props) {
        super(props)

        this.state = {...INITIAL_STATE, success: false, error: ""}
    }

    render() {

        const radios = ["Generell historia", "SM och DM", "Årsdagar"]

        const handleRadioChange = e => {
            this.setState({checked: e.target.id})
        }

        const handleChange = e => {
            this.setState({
                [e.target.name]: e.target.value
            })
        }

        const clear = _ => {
            this.setState({...INITIAL_STATE})
            window.scrollTo(0, 0)
        }

        const onSubmit = e => {
            e.preventDefault()

            this.setState({fetching: true}, () => {

                const { title, description, date, checked } = this.state

                let template
                if (checked === radios[0]) {
                    template = "general"
                } else if (checked === radios[1]) {
                    template = "sm"
                } else if (checked === radios[2]) {
                    template = "anniversary"
                } else template = "general"

                const body = { title, description, date, template }
                
                fetch(`${ROUTES.API_CREATE_EVENT}?token=${localStorage.getItem("token")}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                })
                .then(res => res.json())
                .then(res => {
                    this.setState({fetching: false})
                    if (res.error) {
                        this.setState({error: res.error})
                    } else {
                        this.setState({...SUCCESS_STATE})
                    }
                    window.scrollTo(0, 0)
                })
                .catch(err => {
                    console.log(err)
                    this.setState({fetching: false, error: err})
                    window.scrollTo(0, 0)
                })
            })

        }

        const invalid = this.state.title === "" || this.state.date === "" || this.state.checked === ""
        const clearDisabled = this.state.title !== "" || this.state.date !== "" || this.state.checked !== ""

        if (localStorage.getItem('token')) {
            return (
                <div className="SkapaHändelse">
                    <div className="Header">
                       <h2>Skapa händelse</h2>
                    </div>
                    <div className="Body">
                        <div className="Box">
                            {this.state.success && <Alert>Ditt händelseförslag har sparats.</Alert>}
                            {this.state.error && <Alert type="error">{this.state.error.toString()}</Alert>}
                            <h3 id="obligatorisk">Titel</h3>
                            <input
                                name="title" type="text"
                                placeholder="Titel"
                                value={this.state.title}
                                autoComplete="off"
                                onChange={e => handleChange(e)}
                            />
                            <h3>Beskrivning</h3>
                            <textarea
                                name="description"
                                placeholder="TODO: Markdowneditor"
                                value={this.state.description}
                                onChange={e => handleChange(e)}
                            />
                            <h3 id="obligatorisk">Datum</h3>
                            <input
                                name="date"
                                type="date"
                                value={this.state.date}
                                onChange={e => handleChange(e)}
                            />
                            <h3 id="obligatorisk">Typ av händelse</h3>
                            <h4>Påverkar hur händelsen ser ut på tidslinjen</h4>
                            <div className="radios">
                                {radios.map(x => 
                                    <div className="radio">
                                        <input id={x} type="radio" checked={this.state.checked === x} onChange={e => handleRadioChange(e)}/>
                                        <label htmlFor={x}>{x}</label>
                                    </div>   
                                )}
                            </div>
                            <div className="Skapa">
                                <button
                                    id="Skapa"
                                    onClick={e => onSubmit(e)}
                                    disabled={invalid}
                                >Skapa händelseförslag</button>
                                <button onClick={_ => clear()} disabled={!clearDisabled}>Återställ</button>
                            </div>
                        </div>
                    </div>

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