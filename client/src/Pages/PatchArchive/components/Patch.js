import React,  { useState } from 'react'
import Tag from '../../../components/Tag'
import moment from 'moment'
import { PRICE_TYPES } from '../../../config/constants'
import * as ROUTES from '../../../routes'

// Component that displays a patch.
const Patch = ({image, date, name, description, tags = [], price, inStock = false, ...rest}) => {

    const [hovered, setHovered] = useState(false)
    let displayPrice

    if (price.type === PRICE_TYPES.SET_PRICE) {
        displayPrice = price.value + " SEK"
    } else displayPrice = price.type

    return (
        <div
            className="märke"
            title={description}
            onClick={() => {rest.history.push(`${ROUTES.MÄRKE.replace(/\:id/, rest._id)}`)}}
            onMouseEnter={_ => setHovered(true)}
            onMouseLeave={_ => setHovered(false)}
            onTouchStart={_ => setHovered(true)}
            onTouchMove={_ => setHovered(false)}
            onTouchEnd={_ => setHovered(false)}
        >
            {hovered &&
                <div className="hover" title="Klicka för detaljer">
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
                    <div>
                        Klicka för detaljer
                    </div>
                </div>
            }
            <div className="image" style={{backgroundImage: `url(${rest.imageLowRes || image})`, backgroundColor:"#ddd"}}></div>
            <div className="head">
                <div
                    className="item date"
                    title="Utgivningsdatum (första utgåvan)"
                >
                    <div><i className="far fa-clock"></i> {date ? moment(date).format("D MMM YYYY") : "Okänt"}</div>
                </div>
                <div className="item stock">
                    {inStock ?
                        <div><i className="fas fa-check"></i> Till salu</div>
                        :
                        <div><i className="fas fa-times"></i> Säljs ej</div>
                    }
                    {/* <div><i className="fas fa-box-open"></i> {inStock ? "Till salu" : "Säljs ej"}</div> */}
                </div>
                {/* {inStock &&
                    <div
                        className="item price"
                        title="Pris"
                    >
                        <div><i className="fas fa-dollar-sign"></i> {displayPrice}</div>
                    </div>
                } */}
            </div>
            <div className="title"><h2>{name}</h2></div>
        </div>
    )
}

export default Patch