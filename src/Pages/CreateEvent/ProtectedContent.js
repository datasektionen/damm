import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import * as ROUTES from '../../routes'
import NotFound from '../../components/NotFound'
import Unauthorized from '../../components/Unauthorized'
import InternalError from '../../components/InternalError'

// Component that fetches data upon first mount.
// Renders 401, 404 or the child component with injected data depending on access rights
// Used for event and patch pages.
const ProtectedContent = ({contentURL = "", ...rest}) => {
    console.log(rest)
    const [data, setData] = useState(undefined)

    useEffect(_ => {
        if (!localStorage.getItem("token")) return
        async function fetchData() {
            try {
                let data = await fetch(`${contentURL}`)
                data = await data.json()
                setData(data)
                console.log(data)
            } catch(err) {
                
            }
            console.log("FETCHING")
        }
        fetchData()
    }, [true])

    if (!localStorage.getItem("token")) return <Redirect to={ROUTES.LOGIN} />

    //Fetching, display nothing, possible display placeholder data
    if (!data) {
        return <div></div>
    }

    // We are unauthorized to see the page, we are not admin.
    if (data.httpStatus === 401) {
        return <Unauthorized />
    }

    // Event can not be found.
    if (data.httpStatus === 404) {
        console.log(data)
        return <NotFound />
    }

    // Something else went wrong...
    if (data.error) {
        return <InternalError />
    }

    //Everything went ok.
    //Inject the data into the child component(s)
    return React.cloneElement(rest.children, {data})
}

export default ProtectedContent