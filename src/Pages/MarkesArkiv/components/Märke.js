import React from 'react'
import Tag from '../../../components/Tag'
import moment from 'moment'

const Märke = ({image, date, name, description, numProduced = "?", tags = [], price, ...rest}) => {

    let displayPrice
    if (price === undefined || price === "") displayPrice = "Gratis"
    else if (price === "-") displayPrice = "Säljs ej"
    else displayPrice = price + " kr"

    return (
        <div className="märke" title={description} onClick={() => {window.location=`/marke/${rest._id}`}}>
                <div><img src={image} /></div>
                <div className="head">
                    <div className="date" title="Utgivningsdatum (första utgåvan)">{date ? moment(date).format("DD MMM YYYY") : "Okänt"}</div>
                    {/* <div className="produced" title="Antal producerade (första utgåvan)">{numProduced} st</div> */}
                    <div className="price" title="Pris">{displayPrice}</div>
                </div>
                <div className="title"><h2>{name}</h2></div>
                {/* <div className="desc">{description ? description : "Ingen beskrivning"}</div> */}
                <div className="tags">
                    {tags.length === 0 ? "Inga taggar" : tags.map((x,i) => <Tag key={i} color={x.color} backgroundColor={x.backgroundColor} hoverText={x.hoverText} text={x.text} />)}
                </div>
        </div>
    )
}

export default Märke