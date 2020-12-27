import React, { useEffect, useState } from 'react'
import { Redirect, useLocation } from 'react-router-dom'
import * as ROUTES from '../routes'
import NotFound from './NotFound'
import Unauthorized from './Unauthorized'
import InternalError from './InternalError'

import spinner from '../res/spinner.svg'
import Spinner from './Spinner'

// Component that fetches data upon first mount.
// Renders 401, 404 or the child component with injected data depending on access rights
// Used for event and patch pages.
const ProtectedContent = ({contentURL = [], allowNoLogin = false, ...rest}) => {
    const [data, setData] = useState(undefined)
    let location = useLocation()

    async function fetchData() {
        try {
            // contentURL[0] should be the head content needed to load the page
            let data = await Promise.all(contentURL.map(url =>
                fetch(url)
                .then(res => res.json())
                .then(json => {
                    if (!json.error) return json
                    else {
                        rest.history.push(ROUTES.LOGIN)
                        return {}
                    }
                })
            ))
            setData(data)
        } catch(err) {
            rest.history.push(ROUTES.LOGIN)
        }
        console.log("FETCHING")
    }

    useEffect(_ => {
        if (!allowNoLogin && !localStorage.getItem("token")) return
        fetchData()
    }, [location])

    if (!allowNoLogin && !localStorage.getItem("token")) return <Redirect to={ROUTES.LOGIN} />

    //Fetching, display nothing, possible display placeholder data
    if (!data) {
        return <Spinner height="90vh" />
    }

    // We are unauthorized to see the page, we are not admin.
    if (data[0].httpStatus === 401) {
        return <Unauthorized />
    }

    // Event can not be found.
    if (data[0].httpStatus === 404) {
        console.log(data)
        return <NotFound />
    }

    // Something else went wrong...
    if (data[0].error) {
        return <InternalError />
    }

    //Everything went ok.
    //Inject the data into the child component(s)
    return React.cloneElement(rest.children, {data, fetchData})
}

export default ProtectedContent