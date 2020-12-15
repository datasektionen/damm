import React from 'react'
import * as ROUTES from '../../routes'
import AdminPatchView from './views/AdminPatchView'
import Alert from '../../components/Alert'

const INITIAL_STATE = {
    image: undefined,
    files: [],
    resetFile: () => {},
    selectedTags: [],
    name: "",
    description: "",
    date: "",
    price: {type: "", value: ""},
    submitting: false,
    orders: [],
    orderdate: "",
    company: "",
    order: "",
    error: "",
}

const SUCCESS_STATE = {...INITIAL_STATE, success: true}
const RESET_STATE = {...INITIAL_STATE, success: false}

class AdminPatchCreate extends React.Component {
    constructor(props) {
        super(props)

        this.state = {...INITIAL_STATE, success: false, tags: [],}
        
        this.submit = this.submit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleRadioChange = this.handleRadioChange.bind(this)
    }

    componentDidMount() {
        const fetchTags = () => {
            fetch(ROUTES.API_GET_TAGS)
            .then(res => res.json())
            .then(res => {
                console.log(res)
                this.setState({tags: res})
            })
            .catch(err => {
                console.log(err)
            })
        }

        fetchTags()
    }

    submit(e) {
        e.preventDefault()

        this.setState({success: false, submitting: true})

        const {name, description, date, selectedTags, orders, price, image, files} = this.state

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

        const formData = new FormData()
        
        Object.keys(body).forEach(key => {
            formData.append(key, JSON.stringify(body[key]))
        })
        console.log(formData)
        formData.append('image', image)
        files.forEach(file => {
            formData.append('files', file)
        })

        fetch(`${window.location.origin}${ROUTES.API_CREATE_PATCH}?token=${localStorage.getItem('token')}`, {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(json => {
            this.setState({submitting: false})
            if (json.success) {
                this.state.resetFile()
                this.setState({...SUCCESS_STATE, tags: this.state.tags})
                window.scrollTo(0, 0)
            } else {
                this.setState({submitting: false})
                //TODO: Visa "något gick fel, försök igen"
                this.setState({error: json.error})
                window.scrollTo(0, 0)
            }
        })
        .catch(err => {
            window.scroll(0,0)
            this.setState({error: err.toString(), submitting: false})
        })
        console.log("SUBMIT")
    }

    handleChange(e) {
        this.setState({success: false})
        if (e.target.name === "price") {
            this.setState({
                price: {
                    type: this.state.price.type,
                    value: e.target.value
                }
            })
            return
        }
        this.setState({[e.target.name]: e.target.value})
    }

    handleRadioChange(e) {
        this.setState({
            price: {
                type: e.target.id,
                value: ""
            }
        })
    }

    render() {
        const reset = _ => {
            this.setState({
                ...RESET_STATE,
            })
            this.state.resetFile()
        }

        const addOrder = e => {
            e.preventDefault()
            this.setState({orders: this.state.orders.concat({company: this.state.company, order: this.state.order, date: this.state.orderdate})}, () => {
                this.setState({order: "", company: "", orderdate: ""})
            })
        }

        const removeOrder = (e, index) => {
            e.preventDefault()
            this.setState({orders: this.state.orders.filter((x,i) => index !== i)})
        }

        return (
            <AdminPatchView
                header = "Lägg till märke"
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
                handleChange={this.handleChange}
                handleRadioChange={this.handleRadioChange}
                submitting={this.state.submitting}
                toggleTag={tag => {
                    // If tag is not in selectedTags array, add the tag
                    // Else remove it
                    if (this.state.selectedTags.filter(t => t._id === tag._id).length === 0) this.setState({selectedTags: this.state.selectedTags.concat(tag)})
                    else this.setState({selectedTags: this.state.selectedTags.filter(t => t._id !== tag._id)})
                }}
                setImageCallback={(image, resetFile) => this.setState({image, resetFile})}
                setFileCallback={(file, resetFile) => this.setState({files: this.state.files.concat(file)})}
            >
                {this.state.success && <Alert type="success">Märket sparat!</Alert>}
                {this.state.error && <Alert type="error">{this.state.error}</Alert>}
            </AdminPatchView>
        )
    }
}

export default AdminPatchCreate