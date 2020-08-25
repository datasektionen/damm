import React from 'react'
import Tag from './Tag'

const Märke = ({image, date, title, description, numProduced = "?", tags = []}) => {
    return (
        <div className="märke">
                {/* <span className="content">
                    <div className="head">
                        <img src={image} />
                        <span className="Name"><h2>{title}</h2></span>
                        <div title="Utgivningsdatum (första utgåvan)" className="Date">{date.format("DD MMM YYYY")}</div>
                        <div title="Antal producerade (första utgåvan)" className="Produced">{numProduced}</div>
                    </div>
                    <div className="body">
                        {description ? <MDReactComponent text={description} /> : false}
                    </div>
                </span> */}
                <div><img src={image} /></div>
                <div className="head">
                    <div className="date" title="Utgivningsdatum (första utgåvan)">{date.format("DD MMM YYYY")}</div>
                    <div className="produced" title="Antal producerade (första utgåvan)">{numProduced} st</div>
                </div>
                <div className="title"><h2>{title}</h2></div>
                <div className="tags">
                    {tags.length === 0 ? "Inga taggar" : tags.map((x,i) => <Tag key={i} color={x.color} bgColor={x.color} backgroundColor={x.backgroundColor} hoverText={x.hoverText} text={x.text} />)}
                </div>
        </div>
    )
}

export default Märke