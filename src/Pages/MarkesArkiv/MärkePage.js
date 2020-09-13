import React from 'react'
import * as ROUTES from '../../routes'
import moment from 'moment'
import './MärkePage.css'
import Tag from './Tag'

class MärkePage extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            name: "",
            price: "",
            date: "",
            tags: [],
            image: "",
            createdBy: [],
            files: [{name:"Testfiladwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww"}, {name:"Testfil"}],
            edit: false,
            fetching: true
        }
    }

    componentDidMount() {
        let id = this.props.location.pathname.split("/marke/")[1]

        fetch(window.location.origin + ROUTES.API_GET_TAG + id)
        .then(res => res.json())
        .then(json => {
            this.setState({...json[0], fetching: false})
        })
        .catch(err => {
            console.log(err)
        })
    }

    render() {

        const priceDisplay = _ => {
            if (this.state.price === "-") return "Säljs ej"
            else if (this.state.price.toLowerCase() === "gratis") return "Gratis"
            else if (this.state.price === "") return "Okänt pris"
            else return this.state.price + " kr"
        }


            return (
                <div className="MarkeInfo">
                    <div className="patch">
                        <div className="patchimg">
                            <img id="patch" src={this.state.image} />
                            {this.props.admin ? 
                                <div className="files">
                                    {this.state.files.map(file => <div className="file"><i class="far fa-file"></i><a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a></div>)}
                                    {this.props.admin && <button className="adminedit">Redigera</button>}
                                </div>
                            : undefined                    
                            }
                        </div>
                        <div className="patchcontent">
                            <div className="name">
                                <h1>{this.state.name}</h1>
                            </div>
                            <div className="meta">
                                {this.state.date ? moment(this.state.date).format("DD MMM YYYY") : "????-??-??"}
                                <i class="fas fa-circle"></i>
                                {priceDisplay()}
                            </div>
                            <div className="description">
                                {this.state.description ? this.state.description : "Ingen beskrivning"}
                            </div>
                            {/* <div className="creators">
                                <span>{this.state.createdBy.length !== 0 ? "Skapat av: " : ""}</span>
                                {this.state.createdBy.map((creator, i) => <span id="creator">{creator.firstName}{creator.lastName ? " " + creator.lastName : ""}{i === this.state.createdBy.length - 1 ? "" : ", "}</span>)}
                            </div> */}
                            <div className="tags">
                                {this.state.tags.map(tag => <Tag {...tag} />)}
                            </div>
                        </div>
                    </div>
                </div>
            )
    }

}

export default MärkePage