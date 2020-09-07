import React from 'react'
import * as ROUTES from '../../routes'
import TagClickable from '../MarkesArkiv/TagClickable'
import memoize from "memoize-one";

class EditTag extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            text: "",
            color: "",
            backgroundColor: "",
            hoverText: "",
            fetching: false
        }
    }

    getProps = memoize((props) => {
        const {text = "", color = "", backgroundColor="", hoverText = ""} = props
        this.setState({text, color, backgroundColor, hoverText})
    })


    render() {

        const updateProps = this.getProps(this.props)
        
        const handleChange = e => {
            this.setState({[e.target.name]: e.target.value})
        }
        
        const save = e => {
            e.preventDefault()
            console.log("Saving...")
            
            if (this.props.edit) {
                const body = {...this.state, _id: this.props._id}
                this.setState({fetching: true}, () => {
                    fetch(`${ROUTES.API_UPDATE_TAG}?token=${localStorage.getItem('token')}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(body)
                    })
                    .then(res => res.json())
                    .then(res => {
                        if (res.error) {
                            console.log(res.error)
                        } else {
                            console.log(res)
                            this.props.fetchTags()
                            this.setState({fetching: false})
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
                })
            } else {
                const body = {...this.state}
                this.setState({fetching: true}, () => {
                    fetch(`${ROUTES.API_CREATE_TAG}?token=${localStorage.getItem('token')}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(body)
                    })
                    .then(res => res.json())
                    .then(res => {
                        console.log(res)
                        if (res.error) {
    
                        } else {
                            this.props.fetchTags()
                            this.setState({fetching: false})
                        }
                    })
                    .catch(err => {
                        
                    })
                })
            }

        }

        const noChange = () => {
            return this.state.text === this.props.text && this.state.color === this.props.color && this.state.backgroundColor === this.props.backgroundColor && this.state.hoverText === this.props.hoverText
        }

        const reset = e => {
            e.preventDefault()
            const {text = "", color = "", backgroundColor="", hoverText = ""} = this.props
            this.setState({text, color, backgroundColor, hoverText})
        }

        const deleteTag = e => {
            this.setState({fetching: true}, () => {
                const body = {_id: this.props._id}
                fetch(`${window.location.origin}${ROUTES.API_DELETE_TAG}?token=${localStorage.getItem('token')}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                })
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    if (res.error) {
                        console.log(res.error)
                    } else {
                        this.props.fetchTags()
                        this.setState({fetching: false})
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            })
        }
        
        return (
                <div className="edittagcard">
                    <h1>{this.props.edit ? "Redigera tagg" : "Skapa ny tagg"}</h1>
                    <form>
                        <div className="preview">
                            <span>Förhandsgranskning</span>
                            <TagClickable {...this.state} selectedTags={[{text: this.state.text}]} onClick={() => {}} />
                        </div>
                        <div className="name">
                            <span>Namn</span>
                            <input maxLength={18} name="text" autoComplete="off" id="text" type="text" value={this.state.text} onChange={e => handleChange(e)} />
                        </div>
                        <div className="hover">
                            <span>Svävartext</span>
                            <input name="hoverText" autoComplete="off" id="hoverText" type="text" value={this.state.hoverText} onChange={e => handleChange(e)} />
                        </div>
                        <div className="color">
                            <span>Textfärg</span>
                            <input name="color" type="color" value={this.state.color} onChange={e => handleChange(e)} />
                        </div>
                        <div className="bgcolor">
                            <span>Bakgrundsfärg</span>
                            <input name="backgroundColor" type="color" value={this.state.backgroundColor} onChange={e => handleChange(e)} />
                        </div>
                        <div className="buttons">
                            <button onClick={e => reset(e)}>Ångra ändringar</button>
                            <button id="save" onClick={e => save(e)} disabled={noChange() || this.state.fetching}>Spara</button>
                            {this.props.edit ? <i onClick={e => deleteTag(e)} title="Ta bort" disabled={this.state.fetching} className="fas fa-trash"></i> : undefined}
                        </div>
                    </form>
                </div>
            )
        }
}

export default EditTag