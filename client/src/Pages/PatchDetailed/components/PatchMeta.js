import React from 'react'
import moment from 'moment'
import './PatchMeta.css'
import { PRICE_TYPES } from '../../../config/constants'


const PatchMeta = ({data}) => {
    const priceDisplay = _ => {
        const price = data.price
        if (price.type === PRICE_TYPES.SET_PRICE) {
            return price.value + " SEK"
        } else return price.type
    }

    return (
        <div className="PatchMeta">
            <div className="meta">
                <span title="Första försäljningsdatum">
                    <i className="far fa-clock"></i> {data.date ? moment(data.date).format("DD MMM YYYY") : "Okänt"}
                </span>
                <i className="fas fa-circle"></i>
                <span title="Uppladdningsdatum"><i className="fas fa-cloud-upload-alt"></i> {moment(data.createdAt).format("DD MMM YYYY")}</span>
                <i className="fas fa-circle"></i>
                <span title="Pris">
                    <i className="fas fa-dollar-sign"></i> {priceDisplay()}
                </span>
                <i className="fas fa-circle"></i>
                <span title={data.inStock ? "Till salu" : "Säljs ej"}>
                    <i className={data.inStock ? "fas fa-check" : "fas fa-times"}></i> {data.inStock === true ? "Till salu" : "Säljs ej"}
                </span>
                <i className="fas fa-circle"></i>
                <span title="Antal producerade (stämmer ej för märken äldre än Damm)">
                    <i className="fas fa-hashtag"></i> {data.produced} st
                </span>
            </div>
            {data.creators.length !== 0 && 
                <div className="meta">
                        Skapad av:
                        {data.creators.map(c => <span id="cName">{c.name}</span>)}
                </div>
            }
        </div>
    )
}

export default PatchMeta