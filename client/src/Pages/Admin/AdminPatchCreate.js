import React from 'react'
import * as ROUTES from '../../routes'
import AdminPatchView from './views/AdminPatchView'
import Alert from '../../components/Alert'
import e from 'cors'

const INITIAL_STATE = {
    image: undefined,
    files: [],
    resetImage: () => {},
    resetFile: () => {},
    selectedTags: [],
    name: "",
    description: "",
    date: "",
    price: {type: "", value: ""},
    submitting: false,
    orders: [],
    error: "",
    inStock: false,
    comment: "",
    creators: [],
    creatorField: "",
    amount: 0,
    orderDate: "",
    order: "",
    company: "",
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
        this.updateState = this.updateState.bind(this)
    }

    componentDidMount() {
        window.scrollTo(0, 0)
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

    updateState(next) {
        this.setState({...next})
    }

    submit(e) {
        e.preventDefault()

        this.setState({success: false, submitting: true})

        const {name, description, date, selectedTags, orders, price, image, files, inStock, comment, creators} = this.state

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
            creators
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

        let status = 0
        fetch(`${window.location.origin}${ROUTES.API_CREATE_PATCH}?token=${localStorage.getItem('token')}`, {
            method: "POST",
            body: formData
        })
        .then(res => {
            status = res.status
            return res.json()
        })
        .then(json => {
            this.setState({submitting: false})
            if (!json.error) {
                this.state.resetImage()
                this.state.resetFile()
                this.setState({...SUCCESS_STATE, tags: this.state.tags})
                window.scrollTo(0, 0)
            } else {
                this.setState({submitting: false})
                this.setState({error: json.error})
                window.scrollTo(0, 0)
            }
        })
        .catch(err => {
            window.scroll(0,0)
            let error = err.toString()
            if (status == 413) {
                error = "413 Payload Too Large. Filen är större än vad servern tillåter."
            }
            this.setState({error: error, submitting: false})
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
            this.state.resetImage()
            this.state.resetFile()
        }

        const addOrder = e => {
            e.preventDefault()
            this.setState({orders: this.state.orders.concat({amount: this.state.amount, company: this.state.company, order: this.state.order, date: this.state.orderDate})}, () => {
                this.setState({amount: 0, order: "", company: "", orderDate: ""})
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
                inStock={this.state.inStock}
                handleCheckbox={_ => this.setState({inStock: !this.state.inStock})}
                comment={this.state.comment}
                creators={this.state.creators}
                creatorField={this.state.creatorField}
                orders={this.state.orders}
                order={{
                    order: this.state.order,
                    amount: this.state.amount,
                    date: this.state.orderDate,
                    company: this.state.company
                }}
                addOrder={addOrder}
                removeOrder={removeOrder}
                addCreator={e => {
                    e.preventDefault()
                    this.setState({creators: this.state.creators.concat({name: this.state.creatorField, GDPR: true})}, _ => this.setState({creatorField: ""}))
                }}
                removeCreator={index => {
                    this.setState({creators: this.state.creators.filter((x,i) => i !== index)})
                }}
                updateState={this.updateState}
                setImageCallback={(image, resetImage) => this.setState({image, resetImage})}
                setFileCallback={(file, resetFile) => this.setState({files: this.state.files.concat(file), resetFile})}
            >
                {this.state.success && <Alert type="success">Märket sparat!</Alert>}
                {this.state.error && <Alert type="error">{this.state.error}</Alert>}
            </AdminPatchView>
        )
    }
}

export default AdminPatchCreate