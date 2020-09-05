import React from 'react'
import {Link} from 'react-router-dom'
import * as ROUTES from '../../routes'
import TagClickable from '../MarkesArkiv/TagClickable'

const INITIAL_STATE = {
    image: undefined,
    uploading: false,
    imageSrc: "",
    selectedTags: [],
    name: "",
    description: "",
    date: "",
    price: "",
    submitting: false,
    firstName: "",
    lastName: "",
    creators: [],
    orders: [],
    company: "",
    order: "",
    numFiles: 1,
}

const SUCCESS_STATE = {...INITIAL_STATE, success: true}
const RESET_STATE = {...INITIAL_STATE, success: false, tags: [],}

class AdminMärke extends React.Component {
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

        const submit = (e) => {
            e.preventDefault()

            const {name, description, date, price, imageSrc, creators, selectedTags, orders} = this.state

            const body = {
                token: localStorage.getItem('token'),
                name,
                description,
                date,
                price,
                image: `${ROUTES.API_MÄRKE_GET_IMG_PATH}/${imageSrc}`,
                creators,
                selectedTags,
                orders,
            }

            console.log(body)

            this.setState({submitting: true}, () => {
                fetch(`${window.location.origin}${ROUTES.API_CREATE_PATCH}`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(body)
                })
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    // window.location=ROUTES.SKAPA_MÄRKE
                    this.setState({...SUCCESS_STATE, tags: this.state.tags})
                    window.scrollTo(0, 0)
                })
                .catch(err => {
                    console.log(err)
                })
            })
            console.log("SUBMIT")
        }

        const uploadImage = () => {
            const formData = new FormData()
            formData.append('file', this.state.image)
            fetch(ROUTES.API_UPLOAD_IMG_PATH, {
                method: "POST",
                body: formData
            })
            .then(res => res.json())
            .then(res => {
                console.log(res)
                if (res.status === "success") {
                    this.setState({imageSrc: res.filename, uploading: false})
                }
            })
            .catch(err => {
                console.log(err)
            })
        }

        const handleImageChange = (e) => {
            this.setState({image: e.target.files[0], imageSrc: "", uploading: true}, () => {
                uploadImage()
            })
        }

        // const toggleTag = (tag) => {
        //     //Remove from list
        //     if (this.state.selectedTags.includes(tag.text)) {
        //         this.setState({selectedTags: this.state.selectedTags.filter(x => x !== tag.text)})
        //      //Add it to the list
        //     } else {
        //         this.setState({selectedTags: this.state.selectedTags.concat(tag.text)})
        //     }
        // }

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
        }

        const addCreator = (e) => {
            e.preventDefault()
            this.setState({creators: this.state.creators.concat({firstName: this.state.firstName, lastName: this.state.lastName})}, () => {
                this.setState({firstName: "", lastName: ""})
            })
        }

        const removeCreator = (e, index) => {
            e.preventDefault()
            this.setState({creators: this.state.creators.filter((x,i) => index !== i)})
        }

        const addOrder = e => {
            e.preventDefault()
            this.setState({orders: this.state.orders.concat({company: this.state.company, order: this.state.order})}, () => {
                this.setState({order: "", company: ""})
            })
        }

        const removeOrder = (e, index) => {
            e.preventDefault()
            this.setState({orders: this.state.orders.filter((x,i) => index !== i)})
        }

        const invalid = this.state.name.length === 0 || this.state.imageSrc === ""

        return (
            <div className="Admin">
                <div className="Header">
                    <div className="HeaderLeft"><Link to={ROUTES.ADMIN}>« Tillbaka</Link></div>
                    <div><h2>Lägg till märke</h2></div>
                </div>
                <div className="Form">
                    <form onSubmit={(e) => submit(e)}>
                        {this.state.success && <div className="success">Märket sparat!</div>}
                        <div className="file-input">
                            <label>
                                <input id="image" name="image" type="file" onChange={(e) => handleImageChange(e)} />
                                {!this.state.image ?
                                    <div className="preupload">
                                        <div>
                                            <i class="fas fa-upload"></i>
                                        </div>
                                        <div>
                                            <p className="title">Ladda upp en bild på märket</p>
                                            <p>Du kan dra och släppa en fil här.</p>
                                        </div>
                                    </div>
                                :
                                    <div className="preview">
                                        <i class="fa fa-times" onClick={() => this.setState({image: undefined, imageSrc: ""})}></i>
                                        <div>
                                            {this.state.uploading ? <i class="fa fa-spinner"></i> : <i class="fa fa-check" style={{color: "green"}}></i>}
                                            <span className="filename" style={this.state.uploading ? {color: "#000"} : {color: "green"}}>{this.state.uploading ? "Laddar upp..." :  this.state.image.name}</span>
                                        </div>
                                        {this.state.imageSrc && <img src={`${ROUTES.API_MÄRKE_GET_IMG_PATH}/${this.state.imageSrc}`} />}
                                    </div>
                                }
                            </label>
                        </div>
                        <h3>Namn och beskrivning</h3>
                        <input id="name" name="name" type="text" autoComplete={false} placeholder="Namn" value={this.state.name} onChange={(e) => handleChange(e)} />
                        <textarea id="description" name="description" placeholder="Beskrivning" value={this.state.description} onChange={(e) => handleChange(e)} />
                        <div className="date">
                            <h3>Datum</h3>
                            <h4>Lämna tomt om okänt</h4>
                            <input name="date" type="date" value={this.state.date} onChange={(e) => handleChange(e)}/>
                        </div>
                        <div className="price">
                            <h3>Pris</h3>
                            <h4>Lämna tomt om gratis, "-" om det ej säljs och "Gratis" om gratis</h4>
                            <input name="price" type="text" placeholder="Pris" value={this.state.price} onChange={(e) => handleChange(e)}/>
                        </div>
                        <div className="creators">
                                <h3>Skapare</h3>
                                <h4>Namn på den/de som skapat märket (om känt)</h4>
                                <div className="add">
                                    <input type="text" name="firstName" placeholder="Förnamn" value={this.state.firstName} onChange={(e) => handleChange(e)} />
                                    <input type="text" id="lastName" name="lastName" placeholder="Efternamn" value={this.state.lastName} onChange={(e) => handleChange(e)} />
                                    <button onClick={(e) => addCreator(e)} disabled={this.state.firstName === ""}>Lägg till</button>
                                </div>
                                {this.state.creators.map((x,i) => <div className="creator" key={i}>{x.firstName} {x.lastName}<i class="fa fa-times" onClick={(e) => removeCreator(e, i)}></i></div>)}
                        </div>
                        <div className="tagsection">
                            <h3>Taggar</h3>
                            <h4>Lägg till passande taggar till märket. Underlättar sökning.</h4>
                            <div className="tags">
                                {this.state.tags.map((x,i) =>  <TagClickable key={i} onClick={() => {toggleTag(x)}} {...x} selectedTags={this.state.selectedTags}/> )}
                            </div>
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
                                <button onClick={(e) => addOrder(e)}>Lägg till</button>
                            </div>
                            {this.state.orders.map((x,i) => <div className="order" key={i}>{x.company} {x.order}<i class="fa fa-times" onClick={(e) => removeOrder(e, i)}></i></div>)}
                        </div>
                        <div className="BottomButtons">
                            <button disabled={invalid} disabled={this.state.submitting} formAction="submit">Spara märke</button>
                            <button  className="rensa" onClick={(e) => {e.preventDefault(); this.setState({...RESET_STATE})}}>Rensa</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default AdminMärke