import React from 'react'
import Alert from '../../components/Alert'
import FileUploader from '../../components/FileUploader'
import TagClickable from '../../components/TagClickable'
import * as ROUTES from '../../routes'
import { PRICE_TYPES } from '../../config/constants'

import './Admin.css'
import AdminPatchView from './views/AdminPatchView'

class AdminPatchEdit extends React.Component {
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

        const body = {
            name,
            description,
            date,
            price: {
                type: price.type,
                value: price.value
            },
            tags: selectedTags.map(tag => tag._id),
            orders,
        }
        console.log(body)
        const formData = new FormData()
        Object.keys(body).forEach(key => {
            formData.append(key, JSON.stringify(body[key]))
        })

        formData.append("file", this.state.file)
        // data.append("body", JSON.stringify({name, description, date, orders, price: {type: price.type, value: price.value}, tags: selectedTags}))

        fetch(`${ROUTES.API_EDIT_PATCH.replace(/\:id/, this.state.original._id)}?token=${localStorage.getItem("token")}`, {
            method: "POST",
            body: formData
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
            window.scrollTo(0,0)
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
            <AdminPatchView
                header={this.state.name}
                success ={this.state.success}
                error={this.state.error}
                onSubmit={this.submit}
                onReset={reset}
                name={this.state.name}
                description={this.state.description}
                date={this.state.date}
                price={this.state.price}
                tags={this.state.tags}
                selectedTags={this.state.selectedTags}
                handleChange={handleChange}
                handleRadioChange={handleRadioChange}
                submitting={false}
                toggleTag={tag => {
                    // If tag is not in selectedTags array, add the tag
                    // Else remove it
                    if (this.state.selectedTags.filter(t => t._id === tag._id).length === 0) this.setState({selectedTags: this.state.selectedTags.concat(tag)})
                    else this.setState({selectedTags: this.state.selectedTags.filter(t => t._id !== tag._id)})
                }}
                setFileCallback={(file, resetFile) => this.setState({file: file, resetFile})}
                >
                    {this.state.success && <Alert type="success">Märket sparat!</Alert>}
                    {this.state.error && <Alert type="error">{this.state.error}</Alert>}
                    <img draggable="false" src={this.state.image} style={{maxHeight: "200px", maxWidth: "100%"}}/>
            </AdminPatchView>
        )
    }

}

export default AdminPatchEdit