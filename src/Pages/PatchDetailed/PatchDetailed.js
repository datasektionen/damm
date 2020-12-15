import React from 'react'
import * as ROUTES from '../../routes'
import moment from 'moment'
import './PatchDetailed.css'
import Tag from '../../components/Tag'
import PatchDetailedAdminView from './components/PatchDetailedAdminView'
import { PRICE_TYPES } from '../../config/constants'
import Alert from '../../components/Alert'

class PatchDetailed extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            success: "",
            error: "",
        }
    }

    render() {
        console.log(this.props)
        const data = this.props.data[0]
        const priceDisplay = _ => {
            const price = data.price
            if (price.type !== PRICE_TYPES.FREE && price.type !== PRICE_TYPES.NOT_FOR_SALE && price.type !== PRICE_TYPES.UNKNOWN) {
                return price.value + " SEK"
            } else return price.type
        }

        const removeFile = (filename) => {
            if (window.confirm("Är du säker på att du vill ta bort filen? Den försvinner för alltid.")) {
                filename = filename.split("/").pop()
                fetch(`${ROUTES.API_REMOVE_FILE}?token=${localStorage.getItem("token")}`.replace(/\:filename/, filename))
                .then(res => res.json())
                .then(json => {
                    if (!json.error) {
                        this.props.fetchData()
                        this.setState({success: "Filen borttagen.", error: ""})
                    }
                })
                .catch(json => {
                    this.setState({error: json.error, success: ""})
                    console.log(json)
                })
            }
        }

        const hasPls = this.props.pls.includes("admin") || this.props.pls.includes("prylis")

        return (
            <div className="MarkeInfo">
                <div className="patch">
                {this.state.success && <Alert>{this.state.success}</Alert>}
                {this.state.error && <Alert type="error">{this.state.error}</Alert>}
                    <div className="patchbody">
                        <div className="patchimg">
                            <a href={data.image} target="_blank" rel="noopener noreferrer">
                                <img alt="Bild på märke" id="patch" src={data.image} />
                            </a>
                            {this.props.pls.includes("admin") &&
                                <div>
                                    {this.props.pls.includes("admin") && <button className="adminedit" onClick={_ => this.props.history.push(ROUTES.REDIGERA_MÄRKE.replace(/\:id/, data._id))}>Redigera</button>}
                                </div>
                            }
                        </div>
                        <div className="patchcontent">
                            <div className="name">
                                <h1>{data.name}</h1>
                            </div>
                            <div className="meta">
                                <span title="Datum">
                                    <i className="far fa-clock"></i> {data.date ? moment(data.date).format("DD MMM YYYY") : "Okänt"}
                                </span>
                                <i className="fas fa-circle"></i>
                                <span title="Pris">
                                    <i className="fas fa-dollar-sign"></i> {priceDisplay()}
                                </span>
                                <i className="fas fa-circle"></i>
                                <span title="Antal producerade">
                                    <i className="fas fa-hashtag"></i> {data.produced ? data.produced : 0} st
                                </span>
                            </div>
                            <div className="description">
                                {data.description ? data.description : "Ingen beskrivning"}
                            </div>
                            <div className="tags">
                                {data.tags.length === 0 ? 
                                    "Inga taggar"
                                :
                                    data.tags.map((tag,i) => <Tag key={"tag-"+i} {...tag} />)
                                }
                                
                            </div>
                        </div>
                    </div>
                    {hasPls && <PatchDetailedAdminView files={data.files} orders={data.orders} removeFile={removeFile} />}
                </div>
            </div>
        )
    }

}

export default PatchDetailed