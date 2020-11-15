import React from 'react'

const EventDetailed = ({data, ...rest}) => {
    return (
        <div>
            <h1>{data.title}</h1>
            {data.author.user.kthid}
        </div>
    )
}

export default EventDetailed