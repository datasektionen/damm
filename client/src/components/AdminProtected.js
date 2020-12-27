import React from 'react'
import { Redirect } from 'react-router-dom'
import Unauthorized from './Unauthorized'
import * as ROUTES from '../routes'
import Spinner from './Spinner/Spinner'

const AdminProtected = ({component: Component, ...rest}) => {
    // Not logged in
    if (!localStorage.getItem("token")) return <Redirect to={ROUTES.LOGIN} />
    
    //We are not yet done with the fetch that checks if we are admin
    // Display nothing
    // TODO: Display something placeholderish, perhaps customized inside each component
    if (!rest.adminFetchDone) return <Spinner style={{height: "90vh"}} />

    // Admin
    if (rest.pls.includes("admin")) return <Component {...rest} />
    else return <Unauthorized />
}

export const AdminPrylisProtected = ({component: Component, ...rest}) => {
    // Not logged in
    if (!localStorage.getItem("token")) return <Redirect to={ROUTES.LOGIN} />

    //We are not yet done with the fetch that checks if we are admin
    // Display nothing
    // TODO: Display something placeholderish, perhaps customized inside each component
    if (!rest.adminFetchDone) return <Spinner style={{height: "90vh"}} />
    
    // Admin or prylis
    if (rest.pls.includes("admin") || rest.pls.includes("prylis")) return <Component {...rest} />
    else return <Unauthorized />
}

export default AdminProtected