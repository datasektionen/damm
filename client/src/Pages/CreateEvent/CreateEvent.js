import React from 'react'
import {Redirect} from 'react-router-dom'
import * as ROUTES from '../../routes'
import './CreateEvent.css'
import Alert from '../../components/Alert'

import moment from 'moment'
import General from '../Historia/cards/General'
import Anniversary from '../Historia/cards/Anniversary'
import { EVENT_TYPES } from '../../config/constants'
import SubmitButton from '../../components/SubmitButton/SubmitButton'

const INITIAL_STATE = {
    title: "",
    description: "",
    date: "",
    checked: "",
    fetching: false,
    togglePreview: false,
    comment: ""
}

const SUCCESS_STATE = {
    ...INITIAL_STATE,
    success: true,
    error: ""
}

class CreateEvent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {...INITIAL_STATE, success: false, error: ""}
    }

    render() {
        const radios = [
            {text: "Generell historia", value: EVENT_TYPES.GENERAL},
            {text: "Årsdagar", value: EVENT_TYPES.ANNIVERSARY}
        ]

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

                const { title, description, date, checked, comment } = this.state

                const body = { title, description, date, template: checked, comment }
                
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
                if (this.state.togglePreview) window.scrollTo(0, document.body.scrollHeight)
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
                        <form className="Box">
                            {/* Alerts, upon success of error when submitting form */}
                            {this.state.success && <Alert>Ditt händelseförslag har sparats. En administratör kommer inom kort titta igenom ditt förslag.</Alert>}
                            {this.state.error && <Alert type="error">{this.state.error.toString()}</Alert>}
                            
                            <h3 id="obligatorisk">Typ av händelse</h3>
                            <h4>Påverkar hur händelsen ser ut på tidslinjen</h4>
                            <div className="radios">
                                {radios.map((x,i) => 
                                    <div className="radio" key={i}>
                                        <input id={x.value} type="radio" checked={this.state.checked === x.value} onChange={e => this.setState({checked: e.target.id})}/>
                                        <label htmlFor={x.value}>{x.text}</label>
                                    </div>   
                                )}
                            </div>
                            {/* Form beroende på om det är generell historia eller inte */}
                            <ConditionalForm
                                title={this.state.title}
                                description={this.state.description}
                                date={this.state.date}
                                checked={this.state.checked}
                                comment={this.state.comment}
                                handleChange={handleChange}
                            />
                            <div className="info">
                                <h4>Innan ditt förslag kommer upp på tidslinjen måste en administratör godkänna ditt förslag. Genom att skicka in ditt förslag godkänner du att automatiska e-postmeddelanden skickas till dig för att uppdatera dig om din händelse.</h4>
                            </div>
                            {/* Knappar */}
                            <div className="Skapa">
                                <SubmitButton text="Skapa händelseförslag" loading={this.state.fetching} onClick={onSubmit} disabled={invalid || this.state.fetching}/>
                                <button onClick={togglePreview} disabled={this.state.checked === ""}>{"Förhandsgrankning: " + (this.state.togglePreview ? "På" : "Av")}</button>
                                <button onClick={clear} disabled={!clearDisabled}>Återställ</button>
                            </div>
                        </form>
                        {/* Preview av tidslinjen */}
                        {this.state.togglePreview &&
                            <Timeline
                                togglePreview={this.state.togglePreview}
                                title={this.state.title}
                                description={this.state.description}
                                date={this.state.date}
                                checked={this.state.checked}
                            />
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

const Timeline = ({title, description, date, checked}) => {
    // Förhandsgranskning av tidslinjen
    return (
        <div className="Timeline">
            <div key={'year-heading-' + date.split("-")[0]} id={'year-' + date.split("-")[0]}>
                <time className="Year">{ date === "" ? moment().format("YYYY") : date.split("-")[0] }</time>
                <div className="cards">
                    {checked === EVENT_TYPES.GENERAL &&
                        <General
                            order={0}
                            data={{
                                title: title === "" ? "Lorem ipsum dolor sit amet" : title,
                                content: description === "" ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer convallis facilisis dui quis luctus. Donec eget metus non felis sodales sodales ac nec odio. Curabitur lacus velit, rutrum a eros eget, eleifend euismod metus. Aliquam molestie ut nibh sed porttitor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur euismod metus in massa suscipit gravida. Duis sit amet nulla massa. Duis mollis, enim ac posuere luctus, leo orci laoreet tellus, a tempus purus orci quis tortor. In iaculis pulvinar tempor. Nullam commodo finibus ornare. Cras quis purus tempor, fringilla justo nec, ullamcorper nulla. Duis dignissim, turpis ut suscipit sagittis, arcu metus commodo odio, semper suscipit urna augue tincidunt felis." : description,
                                date: date === "" ? moment() : moment(date)
                            }}
                        />
                    }
                    {checked === EVENT_TYPES.ANNIVERSARY &&
                        <Anniversary
                            order={0}
                            data={{
                                title: title === "" ? "Lorem ipsum dolor sit amet" : title,
                                content: "",
                                date: date === "" ? moment() : moment(date)
                            }}
                        />
                    }
                </div>
            </div>
        </div>
    )
}

const ConditionalForm = ({checked, title, description, date, handleChange, comment}) => {
    //Conditional form whether or not it is a "General history" or anniversary
    if (checked === EVENT_TYPES.GENERAL) {
        return (
            <div className="dynamicForm">
                <h3 id="obligatorisk">Titel</h3>
                <input
                    name="title" type="text"
                    placeholder="Titel"
                    value={title}
                    autoComplete="off"
                    onChange={e => handleChange(e)}
                />
                <h3>Beskrivning</h3>
                <h4>Beskriv händelsen. Du kan använda <a href="https://www.markdownguide.org/basic-syntax/" target="_blank" rel="noopener noreferrer">markdown</a> för att stilisera texten</h4>
                <textarea
                    name="description"
                    placeholder="En beskrivning av händelsen"
                    value={description}
                    onChange={e => handleChange(e)}
                />
                <h3 id="obligatorisk">Datum</h3>
                <input
                    name="date"
                    type="date"
                    value={date}
                    onChange={e => handleChange(e)}
                />
                <h3>Kommentar</h3>
                <h4>Har du något att tillägga eller andra kommentarer som är relevant? Motivering?</h4>
                <textarea
                    name="comment"
                    type="text"
                    placeholder="Kommentar"
                    value={comment}
                    onChange={e => handleChange(e)}
                />
            </div>
        )
    } else if (checked === EVENT_TYPES.ANNIVERSARY) {
        return (
            <div className="dynamicForm">
                <h3 id="obligatorisk">Titel</h3>
                <input
                    name="title" type="text"
                    placeholder="Titel"
                    value={title}
                    autoComplete="off"
                    onChange={e => handleChange(e)}
                />
                <h3 id="obligatorisk">Datum</h3>
                <input
                    name="date"
                    type="date"
                    value={date}
                    onChange={e => handleChange(e)}
                />
                <h3>Kommentar</h3>
                <h4>Har du något att tillägga eller andra kommentarer som är relevant? Motivering?</h4>
                <textarea
                    name="comment"
                    type="text"
                    placeholder="Kommentar"
                    value={comment}
                    onChange={e => handleChange(e)}
                />
            </div>
        )
    } else {
        return <div></div>
    }
}

export default CreateEvent