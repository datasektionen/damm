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
            link: ROUTES.SKAPA_MÄRKE,
            buttonText: "Lägg till märke"
        },
        {
            title: "Redigera märke",
            description: "Redigera ett märke genom att gå till dess detaljsida genom att klicka på den.",
            link: ROUTES.MÄRKESARKIV,
            buttonText: "Märkesarkiv"
        },
        {
            title: "Hantera märkestaggar",
            description: "Lägg till, redigera eller ta bort märkestaggar.",
            link: ROUTES.MÄRKESTAGGAR,
            buttonText: "Hantera märkestaggar"
        },
        {
            title: "Lägg till händelse",
            description: "Registrera generell historia du tycker är värdig att förevigas.",
            link: ROUTES.SKAPA_HÄNDELSE,
            buttonText: "Lägg till händelse"
        },
        {
            title: "Ladda om data",
            description: "Laddar om data till tidslinjen (protokoll, val och mandat). Kan vara bra vid en eventuell mörkläggning :)",
            link: ROUTES.HOME,
            buttonText: "Ladda om",
            onClick: () => {
                console.log("LADDAR OM, INTE IMPLEMENTERAT ÄN")
            }
        },
        // {
        //     title: "Lägg till händelse",
        //     description: "Registrera generell historia du tycker är värdig att förevigas.",
        //     link: ROUTES.SKAPA_HÄNDELSE
        // },
        // {
        //     title: "Lägg till händelse",
        //     description: "Registrera generell historia du tycker är värdig att förevigas.",
        //     link: ROUTES.SKAPA_HÄNDELSE
        // },

            // {title: "Hantera förslag", description: "Hantera "},
        ]

        if (this.props.admin && localStorage.getItem('token')) {
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