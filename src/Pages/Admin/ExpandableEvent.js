import moment from 'moment'
import React, { useState } from 'react'
import './ExpandableEvent.css'

import General from '../Historia/cards/General'
import Anniversary from '../Historia/cards/Anniversary'

const ExpandableEvent = ({title, content, template, author, date}) => {

    const [expanded, expand] = useState(false)

    return (
        <div className="ExpandablEvent">
            <div className="row" onClick={_ => expand(!expanded)}>
                <div className="col">
                    <i class="fas fa-chevron-down" style={expanded ? {transform: "rotate(180deg)"} : {}}></i>
                </div>
                <div className="col">
                    {title}
                </div>
                <div className="col">
                    {moment(author.date).format("YYYY-MM-DD HH:MM")}
                </div>
                <div className="col">
                    {author.user.first_name + " " + author.user.last_name}
                </div>
                <div className="col">
                    {template === "general" ? <span style={{color: "#ea4d8f", fontWeight: "bold"}}>Generell historia</span> : <span style={{color: "#E5C100", fontWeight: "bold"}}>Årsdagar</span>}
                </div>
            </div>
            <div className="body" style={expanded ? {} : {display: "none"}}>
                <div className="bodyRow">
                    <span className="radio">
                        <input id="godkänn" type="radio" checked={false} onChange={e => {}}/>
                        <label htmlFor="godkänn">Godkänn</label>
                    </span>
                    <span className="radio">
                        <input id="avslå" type="radio" checked={true} onChange={e => {}}/>
                        <label htmlFor="avslå">Avslå</label>
                    </span>
                    </div>
                {/* <div className="bodyRow"> */}
                    <div className="Timeline" ref={this.previewRef}>
                        <div key={'year-heading-' + 2020} id={'year-' + 2020}>
                            {/* <time className="Year">{ 2020 }</time> */}
                            <div className="cards">
                                {template === "general" &&
                                    <General
                                        order={0}
                                        data={{
                                            title: title,
                                            content: content,
                                            date: moment(date)
                                        }}
                                    />
                                }
                                {template === "anniversary" &&
                                    <Anniversary
                                        order={0}
                                        data={{
                                            title: title,
                                            content: "",
                                            date: moment()
                                        }}
                                    />
                                }
                            </div>
                        </div>
                    </div>
                {/* </div> */}
            </div>
        </div>
    )
}

export default ExpandableEvent