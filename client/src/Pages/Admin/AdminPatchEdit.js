import React from 'react'
import Alert from '../../components/Alert'
import * as ROUTES from '../../routes'
import { PRICE_TYPES } from '../../config/constants'

import './Admin.css'
import AdminPatchView from './views/AdminPatchView'
import { Link } from 'react-router-dom'

class AdminPatchEdit extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedTags: [],
            tags: [],
            imageFile: undefined,
            files: [],
            resetImage: () => {},
            success: "",
            error: "",
            radioValues: Object.values(PRICE_TYPES),
            price: {type: "", value: ""},
            original: {
                image: ""
            },
            fetching: false,
            creatorField: ""
        }

        this.submit = this.submit.bind(this)
        this.updateState = this.updateState.bind(this)
    }

    updateState() {
        this.setState({
            original: {...this.props.data[0]},
            name: this.props.data[0].name,
            description: this.props.data[0].description,
            date: this.props.data[0].date,
            image: this.props.data[0].image,
            orders: this.props.data[0].orders,
            price: this.props.data[0].price,
            selectedTags: this.props.data[0].tags,
            inStock: this.props.data[0].inStock,
            comment: this.props.data[0].comment,
            creators: this.props.data[0].creators,
            // All possible tags
            tags: this.props.data[1],
        })
    }

    componentDidMount() {
        this.updateState()
    }

    componentDidUpdate(prev) {
        if (this.props.data[0] !== prev.data[0]) {
            this.updateState()
        }
    }

    submit(e) {
        e.preventDefault()
        const {name, description, date, selectedTags, orders, price, inStock, comment, creators} = this.state
        this.setState({fetching: true})
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
            inStock,
            comment,
            creators,
        }
        console.log(body)
        const formData = new FormData()
        Object.keys(body).forEach(key => {
            formData.append(key, JSON.stringify(body[key]))
        })

        if (this.state.imageFile) formData.append("image", this.state.imageFile)
        if (this.state.files.length > 0) this.state.files.forEach(file => formData.append("files", file))

        fetch(`${ROUTES.API_EDIT_PATCH.replace(/\:id/, this.state.original._id)}?token=${localStorage.getItem("token")}`, {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(json => {
            console.log(json)
            this.setState({fetching: false})
            window.scrollTo(0, 0)
            if (!json.error) {
                this.props.fetchData()
                this.state.resetImage()
                this.setState({success: json.status, error: ""})
            } else {
                this.setState({error: json.error, success: ""})
            }
        })
        .catch(err => {
            this.setState({fetching: false})
            this.setState({error: err.error, success: ""})
        })
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
                inStock: this.state.original.inStock,
                comment: this.state.original.comment,
                creators: this.state.original.creators,
                imageFile: undefined,
                creatorField: ""
            })
            this.state.resetImage()
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
                submitting={this.state.fetching}
                inStock={this.state.inStock}
                handleCheckbox={_ => this.setState({inStock: !this.state.inStock})}
                comment={this.state.comment}
                creators={this.state.creators}
                creatorField={this.state.creatorField}
                addCreator={e => {
                    e.preventDefault()
                    this.setState({creators: this.state.creators.concat({name: this.state.creatorField, GDPR: true})}, _ => this.setState({creatorField: ""}))
                }}
                removeCreator={index => {
                    this.setState({creators: this.state.creators.filter((x,i) => i !== index)})
                }}
                toggleTag={tag => {
                    // If tag is not in selectedTags array, add the tag
                    // Else remove it
                    if (this.state.selectedTags.filter(t => t._id === tag._id).length === 0) this.setState({selectedTags: this.state.selectedTags.concat(tag)})
                    else this.setState({selectedTags: this.state.selectedTags.filter(t => t._id !== tag._id)})
                }}
                setImageCallback={(image, resetImage) => this.setState({imageFile: image, resetImage})}
                setFileCallback={(file, resetFile) => this.setState({files: this.state.files.concat(file)})}
                >
                    {this.state.success && <Alert type="success">Märket sparat!</Alert>}
                    {this.state.error && <Alert type="error">{this.state.error}</Alert>}
                    <div style={{padding: "10px"}}>
                        <Link to={ROUTES.MÄRKE.replace(/\:id/, this.state.original._id)}>Tillbaka</Link>
                    </div>
                    <img draggable="false" src={this.state.image} style={{maxHeight: "200px", maxWidth: "100%"}}/>
            </AdminPatchView>
        )
    }

}

export default AdminPatchEdit