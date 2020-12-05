import React from 'react'
import FileUploader from '../../components/FileUploader'
import TagClickable from '../../components/TagClickable'
import * as ROUTES from '../../routes'

class EditPatch extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedTags: [],
            tags: []
        }
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

        const fetchPatch = _ => {
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
        
        fetchPatch()
        fetchTags()
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
                selectedTags: this.state.original.tags
            })
        }

        return (
            <div>
                <div className="HeaderBar">
                    <h2>{this.state.name}</h2>
                </div>
                <div>
                    <button className="yellow">Spara</button>
                    <button className="red" onClick={reset}>Återställ</button>
                </div>
                <input type="text" value={this.state.name} />
                <textarea value={this.state.description} />
                <input type="date" value={this.state.date} />
                <FileUploader text="Ladda upp en ny bild på märket, den gamla tas bort" setFileCallback={file => {}} />
                <div style={{display: "flex", flexWrap: "wrap"}}>
                    {this.state.tags.map(tag =>
                        <TagClickable
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
        )
    }

}

export default EditPatch