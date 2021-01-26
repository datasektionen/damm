import React from 'react'
import Alert from '../../components/Alert'
import * as ROUTES from '../../routes'
import './Admin.css'
import { Link } from 'react-router-dom'
import ExpandableItem from '../../components/ExpandableItem'

class Admin extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            success: "",
            error: ""
        }
    }

    componentDidMount() {
        window.scrollTo(0,0)
    }

    render() {

        const patches = [
            {
                title: "Lägg till märke",
                desc: "Lägg till ett nytt (eller gammalt) märke till arkivet för dOsq att beskåda.",
                link: ROUTES.SKAPA_MÄRKE,
                linkText: "Lägg till märke"
            },
            {
                title: "Redigera märken",
                desc: "Redigera märken genom att klicka på märket i märkesarkivet.",
                link: ROUTES.MÄRKESARKIV,
                linkText: "Till märkesarkivet"
            },
            {
                title: "Registrera beställningar",
                desc: "Registrera att du beställt märken. Denna sida är till för att det ska gå snabbare än att behöva gå in på varje enskilt märke.",
                link: ROUTES.ORDER,
                linkText: "Registrera beställningar"
            },
            {
                title: "Hantera märkestaggar",
                desc: "Lägg till, redigera eller ta bort märkestaggar.",
                link: ROUTES.MÄRKESTAGGAR,
                linkText: "Hantera märkestaggar"
            },
        ]

        const timeline = [
            {
                title: "Lägg till händelse",
                desc: "Registrera generell historia du tycker är värdig att förevigas.",
                link: ROUTES.SKAPA_HÄNDELSE,
                linkText: "Lägg till händelse"
            },
            {
                title: "Hantera händelser",
                desc: "Hantera generell historia",
                link: ROUTES.HANTERA_HÄNDELSER,
                linkText: "Hantera händelser"
            },
            {
                title: "Ladda om data",
                desc: "Laddar om data till tidslinjen (protokoll, val och mandat). Kan vara bra vid en eventuell mörkläggning :)",
                link: ROUTES.ADMIN,
                linkText: "Ladda om",
                onClick: () => {
                    fetch(`/api/admin/refresh?token=${localStorage.getItem('token')}`)
                    .then(res => res.json())
                    .then(json => {
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
        ]

        return(
            <div className="Admin">
                <div className="Header">
                    <h2>Administrera</h2>
                </div>
                {this.state.success && <Alert>{this.state.success}</Alert>}
                {this.state.error && <Alert type="error">{this.state.error}</Alert>}
                <div className="Content">
                    {this.props.pls.includes("admin") &&
                        <Section
                            title="Tidslinjen"
                            cards={timeline}
                        />
                    }
                    {(this.props.pls.includes("admin") || this.props.pls.includes("prylis")) &&
                        <Section
                            title="Märken"
                            cards={patches}
                        />
                    }
                </div>
            </div>
        )
    }
}

export default Admin


const Section = ({title = "Titel", cards = []}) => {
    return (
        <ExpandableItem cols={[<b>{title}</b>]} startOpen={true} >
            {cards.map((x,i) => 
                <Card
                    {...x}
                    key={"card-"+x.title}
                />
            )}
        </ExpandableItem>
    )
}

const Card = ({title = "Titel", desc = "Lorem ipsum dolor sit amet.", link = "", linkText = "Kör", onClick}) => {
    return (
        <div className="Card">
            <h2>{title}</h2>
            <p>{desc}</p>
            <div className="Button">
                <Link to={link} onClick={onClick}>{linkText}</Link>
            </div>
        </div>
    )
}