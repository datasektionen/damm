import React from 'react'
import moment from 'moment'
import General from '../../Historia/cards/General'
import Anniversary from '../../Historia/cards/Anniversary'

const EventTimelineView = ({template, title, content, date}) => {
    return (
        <div className="Timeline">
            <div key={'year-heading-' + moment(date).format("YYYY")} id={'year-' + moment(date).format("YYYY")}>
                <time className="Year">{ moment(date).format("YYYY") }</time>
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
                                date: moment(date)
                            }}
                        />
                    }
                </div>
            </div>
        </div>
    )
}

export default EventTimelineView