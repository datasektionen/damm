import React from 'react'
import Alert from '../../components/Alert'
import FileUploader from '../../components/FileUploader'
import TagClickable from '../../components/TagClickable'
import * as ROUTES from '../../routes'
import { PRICE_TYPES } from '../../config/constants'

import './Admin.css'

class EditPatch extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedTags: [],
            tags: [],
            file: undefined,
            resetFile: () => {},
            success: "",
            error: "",
            radioValues: Object.values(PRICE_TYPES),
            price: {type: "", value: ""},
            original: {
                image: ""
            }
        }

        this.submit = this.submit.bind(this)
        this.fetchPatch = this.fetchPatch.bind(this)
    }

    componentDidMount() {
        const fetchTags = _ => {
            fetch(ROUTES.API_GET_TAGS)
            .then(res => res.json())
            .then(tags => {
                this.setState({tags})
            })
            .catch(err => {

            })
        }
        
        this.fetchPatch()
        fetchTags()
    }

    fetchPatch() {
        fetch(`${ROUTES.API_GET_PATCH}${this.props.match.params.id}`)
        .then(res => res.json())
        .then(json => {
            this.setState({
                original: {...json},
                name: json.name,
                description: json.description,
                date: json.date,
                image: json.image,
                orders: json.orders,
                price: json.price,
                selectedTags: json.tags
            })
        })
        .catch(err => {

        })
    }

    submit(e) {
        e.preventDefault()
        const {name, description, date, selectedTags, orders, price} = this.state

        let data = new FormData()
        data.append("file", this.state.file)
        data.append("body", JSON.stringify({name, description, date, orders, price: {type: price.type, value: price.value}, tags: selectedTags}))

        fetch(`${ROUTES.API_EDIT_PATCH.replace(/\:id/, this.state.original._id)}?token=${localStorage.getItem("token")}`, {
            method: "POST",
            body: data
        })
        .then(res => res.json())
        .then(json => {
            console.log(json)
            window.scrollTo(0, 0)
            if (!json.error) {
                this.fetchPatch()
                this.state.resetFile()
                this.setState({success: json.status})
            } else {
                this.setState({error: json.error})
            }
        })
        .catch(err => console.log(err))
    }

    render() {

        const reset = _ => {
            this.setState({
                name: this.state.original.name,
                description: this.state.original.description,
                date: this.state.original.date,
                image: this.state.original.image,
                orders: this.state.original.orders,
                price: this.state.original.price,
                selectedTags: this.state.original.tags,
                file: undefined
            })
            this.state.resetFile()
        }

        const handleChange = e => {
            if (e.target.name === "price") {
                this.setState({
                    price: {
                        type: this.state.price.type,
                        value: e.target.value
                    }
                })
            } else
                this.setState({
                    [e.target.name]: e.target.value
                })            
        }

        const handleRadioChange = e => {
            this.setState({price: {
                type: e.target.id,
                value: this.state.price.value
            }})
        }

        return (
            <div className="Admin">
                <div className="Header">
                    <h2>{this.state.name}</h2>
                </div>
                <div className="Form">
                    <form onSubmit={this.submit}>
                        {this.state.success && <Alert type="success">{this.state.success}</Alert>}
                        {this.state.error && <Alert type="error">{this.state.error}</Alert>}
                        {/* <img src={this.state.image} /> */}
                        <div style={{padding: "10px"}}>
                            <button className="yellow" onClick={this.submit}>Spara</button>
                            <button className="red" onClick={reset}>Återställ</button>
                        </div>
                        <img src={this.state.original.image} style={{maxHeight: "200px"}}/>
                        <h3>Ny bild</h3>
                        <FileUploader style={{width: "100%"}} text="Ladda upp en ny bild på märket, den gamla tas bort" setFileCallback={(file, reset) => this.setState({file, resetFile: reset})} />
                        <h3 id="obligatorisk">Namn</h3>
                        <input
                            type="text"
                            name="name"
                            value={this.state.name}
                            placeholder="Namn"
                            onChange={handleChange}
                            autoComplete="off"
                        />
                        <h3>Beskrivning</h3>
                        <textarea
                            name="description"
                            value={this.state.description}
                            placeholder="Beskrivning"
                            onChange={handleChange}
                            autoComplete="off"
                        />
                        <h3>Datum</h3>
                        <input
                            type="date"
                            value={this.state.date}
                            name="date"
                            onChange={handleChange}
                        />
                        <h3 id="obligatorisk">Pris</h3>
                        <div>
                            {this.state.radioValues.map((x,i) =>
                                <div key={"radioprice-"+i} className="radio">
                                    <input id={x} type="radio" checked={this.state.price.type === x} onChange={e => handleRadioChange(e)}/>
                                    <label htmlFor={x}>{x}</label>
                                </div>    
                            )}
                        </div>
                        {this.state.price.type === PRICE_TYPES.SET_PRICE && <input name="price" type="text" value={this.state.price.value} onChange={handleChange} />}
                        <h3>Taggar</h3>
                        <div className="tagsection">
                            <div className="tags">
                                {this.state.tags.map(tag =>
                                    <TagClickable
                                        key={tag._id}
                                        {...tag}
                                        onClick={e => {
                                            if (this.state.selectedTags.filter(t => t._id === tag._id).length === 0) this.setState({selectedTags: this.state.selectedTags.concat(tag)})
                                            else this.setState({selectedTags: this.state.selectedTags.filter(t => t._id !== tag._id)})
                                        }}
                                        selectedTags={this.state.selectedTags}
                                    />)
                                }
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

}

export default EditPatch