import React from 'react'
import * as ROUTES from '../../routes'
import TagClickable from '../../components/TagClickable'
import Alert from '../../components/Alert'
import { PRICE_TYPES } from '../../config/constants'

import FileUploader from '../../components/FileUploader'

const INITIAL_STATE = {
    image: undefined,
    resetFileComponent: () => {},
    selectedTags: [],
    name: "",
    description: "",
    date: "",
    radioPrice: "",
    price: "",
    submitting: false,
    orders: [],
    orderdate: "",
    company: "",
    order: "",
    error: "",
}

const SUCCESS_STATE = {...INITIAL_STATE, success: true}
const RESET_STATE = {...INITIAL_STATE, success: false, selectedTags: [],}

class AdminPatch extends React.Component {
    constructor(props) {
        super(props)


        this.state = {...INITIAL_STATE, success: false, tags: [],}
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

    render() {
        
        const radioValues = Object.values(PRICE_TYPES)

        const submit = (e) => {
            e.preventDefault()

            this.setState({success: false})

            const {name, description, date, selectedTags, orders, orderdate} = this.state
            let price = this.state.price

            if (this.state.radioPrice === PRICE_TYPES.SET_PRICE) price = this.state.price
            else price = this.state.radioPrice

            const body = {
                name,
                description,
                date,
                price,
                radioPrice: this.state.radioPrice,
                tags: selectedTags.map(tag => tag._id),
                orders,
                orderdate
            }


            console.log(body)
            const formData = new FormData()
            formData.append('file', this.state.image)
            formData.append('body', JSON.stringify(body))
            fetch(`${window.location.origin}${ROUTES.API_CREATE_PATCH}?token=${localStorage.getItem('token')}`, {
                method: "POST",
                body: formData
            })
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    this.state.resetFileComponent()
                    this.setState({...SUCCESS_STATE, tags: this.state.tags})
                    window.scrollTo(0, 0)
                } else {
                    //TODO: Visa "något gick fel, försök igen"
                    this.setState({error: json.error})
                    window.scrollTo(0, 0)
                }
            })
            .catch(err => {
                console.log(err)
                //TODO: Visa "något gick fel, försök igen"
            })
            console.log("SUBMIT")
        }

        const selectedTagsIncludesTag = (tagName) => {
            return this.state.selectedTags.filter((x,i) => x.text === tagName).length > 0
        }

        const toggleTag = (tag) => {
            if (selectedTagsIncludesTag(tag.text)) {
                this.setState({selectedTags: this.state.selectedTags.filter(x => x.text !== tag.text)})
            } else {
                this.setState({selectedTags: this.state.selectedTags.concat(tag)})
            }
        }

        const handleChange = (e) => {
            this.setState({[e.target.name]: e.target.value})
            this.setState({success: false})
        }

        const handleRadioChange = e => {
            this.setState({radioPrice: e.target.id})
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
            <div className="Admin">
                <div className="Header">
                    <div><h2>Lägg till märke</h2></div>
                </div>
                <div className="Form">
                    <form onSubmit={(e) => submit(e)}>
                        {this.state.success && <Alert type="success">Märket sparat!</Alert>}
                        {this.state.error && <Alert type="error">{this.state.error}</Alert>}

                        <h3 id="obligatorisk">Bild på märket</h3>
                        <h4>Ta en så bra bild av märket som möjligt. Skriv en lätt instruktion alternativt länka till en sida med instruktioner</h4>
                        <FileUploader style={{width: "100%"}} setFileCallback={(file, resetFileComponent) => this.setState({image: file, resetFileComponent})}/>
                        <h3 id="obligatorisk">Namn</h3>
                        <input id="name" name="name" type="text" autoComplete="off" placeholder="Namn" value={this.state.name} onChange={(e) => handleChange(e)} />
                        <h3>Beskrivning</h3>
                        <textarea id="description" name="description" placeholder="Beskrivning" value={this.state.description} onChange={(e) => handleChange(e)} />
                        <div className="date">
                            <h3>Datum</h3>
                            <h4>Lämna tomt om okänt</h4>
                            <input name="date" type="date" value={this.state.date} onChange={(e) => handleChange(e)}/>
                        </div>
                        <div className="price">
                            <h3 id="obligatorisk">Pris</h3>
                            <h4>Ange pris för märket</h4>
                            <div>
                                {radioValues.map((x,i) =>
                                    <div key={"radioprice-"+i} className="radio">
                                        <input id={x} type="radio" checked={this.state.radioPrice === x} onChange={e => handleRadioChange(e)}/>
                                        <label htmlFor={x}>{x}</label>
                                    </div>    
                                )}
                            </div>
                            {this.state.radioPrice === PRICE_TYPES.SET_PRICE && <input name="price" type="text" placeholder="Pris" value={this.state.price} onChange={(e) => handleChange(e)}/>}
                        </div>
                        <div className="tagsection">
                            <h3>Taggar</h3>
                            <h4>Lägg till passande taggar till märket. Underlättar sökning.</h4>
                            {this.state.tags.length === 0 ?
                                <div className="tags">
                                    <span className="notags">Inga taggar finns</span>
                                </div>
                            :
                            <div className="tags">
                                {this.state.tags.map((x,i) =>  <TagClickable key={i} onClick={() => {toggleTag(x)}} {...x} selectedTags={this.state.selectedTags}/> )}
                            </div>}
                        </div>
                        {/* <div className="files">
                            <h3>Filer</h3>
                            <h4>Filer som tillhör märket, exempelvis källfiler i vektorformat eller .pdf</h4>
                            <div className="input">
                                <input type="file" />
                                <button onClick={e => {
                                    e.preventDefault()
                                    this.setState({numFiles: this.state.numFiles + 1})
                                }}>Lägg till ny fil</button>
                            </div>
                        </div> */}
                        <div className="orders">
                            <h3>Ordrar</h3>
                            <h4>Ordernummer eller referensnummer från tidigare beställningar. För att underlätta framtida beställningar</h4>
                            <div className="input">
                                <input name="company" type="text" placeholder="Företag" value={this.state.company} onChange={(e) => handleChange(e)} />
                                <input name="order" type="text" placeholder="Referens" value={this.state.order} onChange={(e) => handleChange(e)} />
                                <input name="orderdate" type="date" value={this.state.orderdate} onChange={(e) => handleChange(e)} />
                                <button onClick={(e) => addOrder(e)} disabled={this.state.company === "" || this.state.order === ""}>Lägg till</button>
                            </div>
                            {this.state.orders.map((x,i) => <div className="order" key={i}>{x.company} {x.order}<i class="fa fa-times" onClick={(e) => removeOrder(e, i)}></i></div>)}
                        </div>
                        <div className="BottomButtons">
                            <button disabled={this.state.submitting} formAction="submit">Spara märke</button>
                            <button  className="rensa" onClick={(e) => {e.preventDefault(); this.setState({...RESET_STATE})}}>Rensa</button>
                        </div>
                    </form>
                </div>
            </div>
        )


    }
}

export default AdminPatch