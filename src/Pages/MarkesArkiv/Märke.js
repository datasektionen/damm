import React from 'react'
import Tag from './Tag'

const Märke = ({image, date, name, description, numProduced = "?", tags = [], price}) => {
    return (
        <div className="märke">
                <div><img src={image} /></div>
                <div className="head">
                    <div className="date" title="Utgivningsdatum (första utgåvan)">{date.format("DD MMM YYYY")}</div>
                    {/* <div className="produced" title="Antal producerade (första utgåvan)">{numProduced} st</div> */}
                    <div className="price" title="Pris">{price ? (price + " kr") : "Gratis"}</div>
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