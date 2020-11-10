import React from 'react'
import * as ROUTES from '../../routes'
import moment from 'moment'
import './PatchDetailed.css'
import Tag from '../../components/Tag'
import PatchDetailedAdminInfo from './PatchDetailedAdminInfo'

class PatchDetailed extends React.Component {

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
            orders: [],
            edit: false,
            fetching: true
        }
    }

    componentDidMount() {
        let id = this.props.location.pathname.split("/marke/")[1]

        fetch(window.location.origin + ROUTES.API_GET_PATCH + id)
        .then(res => res.json())
        .then(json => {
            if (json.error) {
                this.props.history.push("/404")
                return
            }
            this.setState({...json[0], fetching: false})
        })
        .catch(err => {
            console.log(err)
        })
    }

    render() {

        const priceDisplay = _ => {
            if (this.state.price === "-") return "Säljs ej"
            else if (this.state.price === "") return "Gratis"
            else return this.state.price + " kr"
        }

        const hasPls = this.props.pls.includes("admin") || this.props.pls.includes("prylis")

        if (this.state.fetching) {
            return <div></div>
        } else 
        return (
            <div className="MarkeInfo">
                <div className="patch">
                    <div className="patchbody">
                        <div className="patchimg">
                            <a href={this.state.image} target="_blank" rel="noopener noreferrer">
                                <img alt="Bild på märke" id="patch" src={this.state.image} />
                            </a>
                            {this.props.pls.includes("admin") &&
                                <div>
                                    {this.props.pls.includes("admin") && <button className="adminedit">Redigera</button>}
                                </div>
                            }
                        </div>
                        <div className="patchcontent">
                            <div className="name">
                                <h1>{this.state.name}</h1>
                            </div>
                            <div className="meta">
                                <i className="far fa-clock"></i> {this.state.date ? moment(this.state.date).format("DD MMM YYYY") : "Okänt"}
                                <i className="fas fa-circle"></i>
                                <i className="fas fa-dollar-sign"></i> {priceDisplay()}
                            </div>
                            <div className="description">
                                {this.state.description ? this.state.description : "Ingen beskrivning"}
                            </div>
                            <div className="tags">
                                {this.state.tags.length === 0 ? 
                                    "Inga taggar"
                                :
                                    this.state.tags.map((tag,i) => <Tag key={"tag-"+i} {...tag} />)
                                }
                                
                            </div>
                        </div>
                    </div>
                    {hasPls && <PatchDetailedAdminInfo files={this.state.files} orders={this.state.orders} />}
                </div>
            </div>
        )
    }

}

export default PatchDetailed