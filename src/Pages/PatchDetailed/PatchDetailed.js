import React from 'react'
import * as ROUTES from '../../routes'
import moment from 'moment'
import './PatchDetailed.css'
import Tag from '../../components/Tag'
import PatchDetailedAdminInfo from './PatchDetailedAdminInfo'
import { PRICE_TYPES } from '../../config/constants'

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
        }
    }

    render() {
        console.log(this.props)
        const priceDisplay = _ => {
            const price = this.props.data.price
            if (price !== PRICE_TYPES.FREE && price !== PRICE_TYPES.NOT_FOR_SALE && price !== PRICE_TYPES.UNKNOWN) {
                return price + " SEK"
            } else return price
        }

        const hasPls = this.props.pls.includes("admin") || this.props.pls.includes("prylis")

        return (
            <div className="MarkeInfo">
                <div className="patch">
                    <div className="patchbody">
                        <div className="patchimg">
                            <a href={this.props.data.image} target="_blank" rel="noopener noreferrer">
                                <img alt="Bild på märke" id="patch" src={this.props.data.image} />
                            </a>
                            {this.props.pls.includes("admin") &&
                                <div>
                                    {this.props.pls.includes("admin") && <button className="adminedit">Redigera</button>}
                                </div>
                            }
                        </div>
                        <div className="patchcontent">
                            <div className="name">
                                <h1>{this.props.data.name}</h1>
                            </div>
                            <div className="meta">
                                <i className="far fa-clock"></i> {this.props.data.date ? moment(this.props.data.date).format("DD MMM YYYY") : "Okänt"}
                                <i className="fas fa-circle"></i>
                                <i className="fas fa-dollar-sign"></i> {priceDisplay()}
                            </div>
                            <div className="description">
                                {this.props.data.description ? this.props.data.description : "Ingen beskrivning"}
                            </div>
                            <div className="tags">
                                {this.props.data.tags.length === 0 ? 
                                    "Inga taggar"
                                :
                                    this.props.data.tags.map((tag,i) => <Tag key={"tag-"+i} {...tag} />)
                                }
                                
                            </div>
                        </div>
                    </div>
                    {hasPls && <PatchDetailedAdminInfo files={this.props.data.files} orders={this.props.data.orders} />}
                </div>
            </div>
        )
    }

}

export default PatchDetailed