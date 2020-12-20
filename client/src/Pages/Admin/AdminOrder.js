import React, { useEffect, useState } from 'react'
import * as ROUTES from '../../routes'
import Dropdown from './components/Dropdown'

const AdminOrder = ({}) => {

    const [patches, setPatches] = useState([])
    const [error, setError] = useState("")
    const [search, setSearch] = useState("")

    useEffect(_ => {
        fetch(ROUTES.API_GET_MÄRKEN)
        .then(res => res.json())
        .then(json => {
            setPatches(json)
        })
        .catch(err => {
            setError(err)
        })
    }, [true])



    return (
        <div>
            <Dropdown
                items={patches}
                search={search}
                searchPlaceholder={"Namn på märke"}
                onChange={e => setSearch(e.target.value)}
                clearSearch={_ => setSearch("")}
            />
            <div>
                <h3>HEJSAN</h3>
            </div>
        </div>
    )
}

export default AdminOrder