import React,  { useState } from 'react'
import Tag from '../../../components/Tag'
import moment from 'moment'

// Component that displays a patch.
const Patch = ({image, date, name, description, numProduced = "?", tags = [], price, ...rest}) => {

    const [hovered, setHovered] = useState(false)
    let displayPrice
    if (price === undefined || price === "") displayPrice = "Gratis"
    else if (price === "-") displayPrice = "Säljs ej"
    else displayPrice = price + " kr"

    return (
        <div
            className="märke"
            title={description}
            onClick={() => {rest.history.push(`/marke/${rest._id}`)}}
            onMouseEnter={_ => setHovered(true)}
            onMouseLeave={_ => setHovered(false)}
            onTouchStart={_ => setHovered(true)}
            onTouchMove={_ => setHovered(false)}
            onTouchEnd={_ => setHovered(false)}
        >
            {hovered &&
                <div className="hover">
                    <div className="tags">
                        {tags.length === 0 ?
                            "Inga taggar"
                        :
                            tags.map((x,i) => 
                                <Tag
                                    key={i}
                                    color={x.color}
                                    backgroundColor={x.backgroundColor}
                                    hoverText={x.hoverText}
                                    text={x.text}
                                />
                            )
                        }
                    </div>
                    Klicka för detaljer
                </div>
            }
            <div className="image" style={{backgroundImage: `url(${image})`}}></div>
            <div className="head">
                <div
                    className="date"
                    title="Utgivningsdatum (första utgåvan)"
                >
                    <div><i className="far fa-clock"></i> {date ? moment(date).format("D MMM YYYY") : "Okänt"}</div>
                </div>
                <div
                    className="price"
                    title="Pris"
                >
                    <div><i className="fas fa-dollar-sign"></i> {displayPrice}</div>
                </div>
            </div>
            <div className="title"><h2>{name}</h2></div>
        </div>
    )
}

export default Patch