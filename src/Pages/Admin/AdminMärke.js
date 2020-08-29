import React from 'react'
import {Link} from 'react-router-dom'
import * as ROUTES from '../../routes'
import TagClickable from '../MarkesArkiv/TagClickable'

class AdminMärke extends React.Component {
    constructor(props) {
        super(props)


        this.state = {
            image: undefined,
            uploading: false,
            imageSrc: "",
            hoverFile: false,
            tags: [],
            selectedTags: [],
            name: "",
            description: "",
            date: "",
            price: "",
            submitting: false,
        }
    }

    componentDidMount() {
        const fetchTags = () => {
            fetch('/api/tags')
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

            const {name, description, date, price, imageSrc} = this.state

            const body = {
                token: localStorage.getItem('token'),
                name,
                description,
                date,
                price,
                image: `${ROUTES.MARKE_IMG_PATH}/${imageSrc}`
            }

            console.log(body)

            this.setState({submitting: true}, () => {
                fetch(`${window.location.origin}/api/admin/marke/create`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(body)
                })
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    window.location=ROUTES.SKAPA_MARKE
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
            fetch('/api/admin/upload', {
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

        const handleFileChange = (e) => {
            this.setState({image: e.target.files[0], imageSrc: "", uploading: true}, () => {
                uploadImage()
            })
        }

        const dragEnter = (e) => {
            console.log(e)
            e.stopPropagation();
            e.preventDefault();
            console.log("Enter mouse")
            this.setState({hoverFile: true})
        }

        const dragLeave = (e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log("Leave mouse")
            this.setState({hoverFile: false})
        }

        const drag = (e) => {
            e.stopPropagation();
            e.preventDefault()
        }

        const dragDrop = (e) => {
            console.log(e)
            e.stopPropagation();
            e.preventDefault();

            console.log(e.dataTransfer)

            let file = e.dataTransfer.files[0]

            if (file)
            this.setState({hoverFile: false, image: file}, () => {
                e.dataTransfer.clearData()
            })
        }

        const toggleTag = (tag) => {
            //Remove from list
            if (this.state.selectedTags.includes(tag.text)) {
                this.setState({selectedTags: this.state.selectedTags.filter(x => x !== tag.text)})
             //Add it to the list
            } else {
                this.setState({selectedTags: this.state.selectedTags.concat(tag.text)})
            }
        }

        const handleChange = (e) => {
            this.setState({[e.target.name]: e.target.value})
        }

        const invalid = this.state.name.length === 0 || this.state.imageSrc === ""

        return (
            <div className="Admin">
                <div className="Header">
                    <div className="HeaderLeft"><Link to={ROUTES.ADMIN}>« Tillbaka</Link></div>
                    <h2>Lägg till märke</h2>
                </div>
                <div className="Form">
                    <form onSubmit={(e) => submit(e)}>
                        <div className="file-input">
                            <label onDrag={(e) => drag(e)} onDrop={(e) => dragDrop(e)} onDragEnter={(e) => dragEnter(e)} onDragLeave={(e) => dragLeave(e)}>
                                <input id="image" name="image" type="file" onChange={(e) => handleFileChange(e)} />
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
                                        {this.state.imageSrc && <img src={`${ROUTES.MARKE_IMG_PATH}/${this.state.imageSrc}`} />}
                                    </div>
                                }
                            </label>
                        </div>
                        <input name="name" type="text" placeholder="Namn" value={this.state.name} onChange={(e) => handleChange(e)} />
                        <textarea name="description" placeholder="Beskrivning" value={this.state.description} onChange={(e) => handleChange(e)} />
                        <input name="date" type="date" value={this.state.date} onChange={(e) => handleChange(e)}/>
                        <input name="price" type="text" placeholder="Pris, lämna tomt om gratis" value={this.state.price} onChange={(e) => handleChange(e)}/>
                        <div className="tags">
                            {this.state.tags.map((x,i) =>  <TagClickable key={i} onClick={() => {toggleTag(x)}} {...x} selectedTags={this.state.selectedTags}/> )}
                        </div>
                        <div className="BottomButtons">
                            <button disabled={invalid} formAction="submit">Spara märke</button>
                            <button  className="rensa" disabled={true}>Rensa</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default AdminMärke