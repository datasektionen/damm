import React from 'react'
import {Redirect} from 'react-router-dom'
import * as ROUTES from '../../routes'
import './SkapaHändelse.css'
import Alert from '../../components/Alert'

import moment from 'moment'
import General from '../Historia/cards/General'
import Anniversary from '../Historia/cards/Anniversary'

const INITIAL_STATE = {
    title: "",
    description: "",
    date: "",
    checked: "",
    fetching: false,
    togglePreview: false
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

        // Reference for forcing scroll
        this.previewRef = React.createRef()
    }

    render() {

        // const radios = ["Generell historia", "SM och DM", "Årsdagar"]
        const radios = ["Generell historia", "Årsdagar"]

        //Handles state change of the radio buttons
        const handleRadioChange = e => {
            this.setState({checked: e.target.id})
        }

        //Handles state change of form fields.
        const handleChange = e => {
            this.setState({
                [e.target.name]: e.target.value
            })
        }

        // Clears the form and scrolls to the top.
        const clear = e => {
            e.preventDefault()
            this.setState({...INITIAL_STATE})
            window.scrollTo(0, 0)
        }

        //Function called when submitting the event. Fetches the backend.
        const onSubmit = e => {
            e.preventDefault()

            this.setState({fetching: true}, () => {

                const { title, description, date, checked } = this.state

                let template
                if (checked === radios[0]) {
                    template = "general"
                }
                // else if (checked === radios[1]) {
                //     template = "sm"
                // }
                else if (checked === radios[1]) {
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

        //Toggles preview of the event, i.e. what it would look like on the timeline
        const togglePreview = e => {
            e.preventDefault()
            this.setState({togglePreview: !this.state.togglePreview}, () => {
                if (this.state.togglePreview) window.scrollTo(0, this.previewRef.current.offsetTop)
            })
        }

        const invalid = this.state.title === "" || this.state.date === "" || this.state.checked === ""
        const clearDisabled = this.state.title !== "" || this.state.date !== "" || this.state.checked !== ""

        //Conditional form whether or not it is a "General history" or anniversary
        let form
        if (this.state.checked === "Generell historia") {
            form = 
            <div className="dynamicForm">
                <h3 id="obligatorisk">Titel</h3>
                <input
                    name="title" type="text"
                    placeholder="Titel"
                    value={this.state.title}
                    autoComplete="off"
                    onChange={e => handleChange(e)}
                />
                <h3>Beskrivning</h3>
                <h4>Beskriv händelsen. Du kan använda <a href="https://www.markdownguide.org/basic-syntax/" target="_blank" rel="noopener noreferrer">markdown</a> för att stilisera texten</h4>
                <textarea
                    name="description"
                    placeholder="En beskrivning av händelsen"
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
            </div>
        } else if (this.state.checked === "Årsdagar") {
            form = 
            <div className="dynamicForm">
                <h3 id="obligatorisk">Titel</h3>
                <input
                    name="title" type="text"
                    placeholder="Titel"
                    value={this.state.title}
                    autoComplete="off"
                    onChange={e => handleChange(e)}
                />
                <h3 id="obligatorisk">Datum</h3>
                <input
                    name="date"
                    type="date"
                    value={this.state.date}
                    onChange={e => handleChange(e)}
                />
            </div>
        } else {
            form = <div></div>
        }

        if (localStorage.getItem('token')) {
            return (
                <div className="SkapaHändelse">
                    <div className="Header">
                       <h2>Skapa händelse</h2>
                    </div>
                    <div className="Body">
                        <form className="Box">
                            {this.state.success && <Alert>Ditt händelseförslag har sparats. En administratör kommer inom kort titta igenom ditt förslag.</Alert>}
                            {this.state.error && <Alert type="error">{this.state.error.toString()}</Alert>}
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
                            {/* Form beroende på om det är generell historia eller inte */}
                            {form}
                            <div className="info">
                                <h4>Innan ditt förslag kommer upp på tidslinjen måste en administratör godkänna ditt förslag. Genom att skicka in ditt förslag godkänner du att automatiska e-postmeddelanden skickas till dig för att uppdatera dig om din händelse.</h4>
                            </div>
                            {/* Knappar */}
                            <div className="Skapa">
                                <button id="Skapa" onClick={onSubmit} disabled={invalid || this.state.fetching}>Skapa händelseförslag</button>
                                <button onClick={togglePreview} disabled={this.state.checked === ""}>{"Förhandsgrankning: " + (this.state.togglePreview ? "På" : "Av")}</button>
                                <button onClick={clear} disabled={!clearDisabled}>Återställ</button>
                            </div>
                        </form>
                        {/* Förhandsgranskning av tidslinjen */}
                        {this.state.togglePreview && 
                            <div className="Timeline" ref={this.previewRef}>
                                <div key={'year-heading-' + this.state.date.split("-")[0]} id={'year-' + this.state.date.split("-")[0]}>
                                    <time className="Year">{ this.state.date === "" ? moment().format("YYYY") : this.state.date.split("-")[0] }</time>
                                    <div className="cards">
                                        {this.state.checked === radios[0] &&
                                            <General
                                                order={0}
                                                data={{
                                                    title: this.state.title === "" ? "Lorem ipsum dolor sit amet" : this.state.title,
                                                    content: this.state.description == "" ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer convallis facilisis dui quis luctus. Donec eget metus non felis sodales sodales ac nec odio. Curabitur lacus velit, rutrum a eros eget, eleifend euismod metus. Aliquam molestie ut nibh sed porttitor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur euismod metus in massa suscipit gravida. Duis sit amet nulla massa. Duis mollis, enim ac posuere luctus, leo orci laoreet tellus, a tempus purus orci quis tortor. In iaculis pulvinar tempor. Nullam commodo finibus ornare. Cras quis purus tempor, fringilla justo nec, ullamcorper nulla. Duis dignissim, turpis ut suscipit sagittis, arcu metus commodo odio, semper suscipit urna augue tincidunt felis." : this.state.description,
                                                    date: this.state.date === "" ? moment() : moment(this.state.date)
                                                }}
                                            />
                                        }
                                        {this.state.checked === radios[1] &&
                                            <Anniversary
                                                order={0}
                                                data={{
                                                    title: this.state.title === "" ? "Lorem ipsum dolor sit amet" : this.state.title,
                                                    content: "",
                                                    date: this.state.date === "" ? moment() : moment(this.state.date)
                                                }}
                                            />
                                        }
                                    </div>
                                </div>
                            </div>
                        }
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