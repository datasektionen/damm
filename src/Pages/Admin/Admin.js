import React from 'react'
import { Redirect } from 'react-router-dom'
import * as ROUTES from '../../routes'
import './Admin.css'
import AdminCard from './AdminCard'

class Admin extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        console.log(this.props)

        const cards = [
        {
            title: "Lägg till märke",
            description: "Lägg till ett nytt (eller gammalt) märke till arkivet för dOsq att beskåda.",
            link: ROUTES.SKAPA_MARKE,
        },
        {
            title: "Hantera märkestaggar",
            description: "Lägg till, redigera eller ta bort märkestaggar.",
            link: ROUTES.MARKESTAGGAR,
        },
        {
            title: "Lägg till händelse",
            description: "Registrera generell historia du tycker är värdig att förevigas.",
            link: ROUTES.SKAPA_HANDELSE
        },
        // {
        //     title: "Lägg till händelse",
        //     description: "Registrera generell historia du tycker är värdig att förevigas.",
        //     link: ROUTES.SKAPA_HANDELSE
        // },
        // {
        //     title: "Lägg till händelse",
        //     description: "Registrera generell historia du tycker är värdig att förevigas.",
        //     link: ROUTES.SKAPA_HANDELSE
        // },

            // {title: "Hantera förslag", description: "Hantera "},
        ]

        if (true /*this.props.admin && localStorage.getItem('token')*/) {
            return (
                <div className="Admin">
                    <div className="Header">
                       <h2>Administrera</h2>
                    </div>
                    <div className="Content">
                        {cards.map(x => <AdminCard {...x} />)}
                    </div>
                </div>
            )
        } else {
            return (<Redirect to={ROUTES.HOME} />)
        }
    }
}

export default Admin