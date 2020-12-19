import React from 'react'
import { Redirect } from 'react-router-dom'
import Alert from '../../components/Alert'
import Unauthorized from '../../components/Unauthorized'
import * as ROUTES from '../../routes'
import './Admin.css'
import AdminCard from './components/AdminCard'

class Admin extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            success: "",
            error: ""
        }
    }

    render() {
        console.log(this.props)

        const prylisCards = [
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
        ]

        const adminCards = [...prylisCards].concat([
            {
                title: "Lägg till händelse",
                description: "Registrera generell historia du tycker är värdig att förevigas.",
                link: ROUTES.SKAPA_HÄNDELSE,
                buttonText: "Lägg till händelse"
            },
            {
                title: "Hantera händelser",
                description: "Hantera generell historia",
                link: ROUTES.HANTERA_HÄNDELSER,
                buttonText: "Hantera händelser"
            },
            {
                title: "Ladda om data",
                description: "Laddar om data till tidslinjen (protokoll, val och mandat). Kan vara bra vid en eventuell mörkläggning :)",
                // link: ROUTES.ADMIN,
                nolink: true,
                buttonText: "Ladda om",
                onClick: () => {
                    console.log("LADDAR OM, INTE IMPLEMENTERAT ÄN")
                    fetch(`/api/admin/refresh?token=${localStorage.getItem('token')}`)
                    .then(res => res.json())
                    .then(json => {
                        console.log(json)
                        if (json.error) {
                            this.setState({error: json.error})
                        } else {
                            this.setState({success: json.response})
                        }
                    })
                    .catch(err => {
                        this.setState({error: err.toString()})
                    })
                }
            },
        ])

        let content
        if (this.props.pls.includes("admin")) {
            content = adminCards.map((x,i) => <AdminCard key={"card-"+i} {...x} />)
        } else if (this.props.pls.includes("prylis")) {
            content = prylisCards.map((x,i) => <AdminCard key={"card-"+i} {...x} />)
        }
        console.log(this.props)

        return(
            <div className="Admin">
                <div className="Header">
                    <h2>Administrera, TODO: Skriv om denna sida</h2>
                </div>
                {this.state.success && <Alert>{this.state.success}</Alert>}
                {this.state.error && <Alert type="error">{this.state.error}</Alert>}
                <div className="Content">
                    {content}
                </div>
            </div>
        )
    }
}

export default Admin