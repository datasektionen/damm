import React, { Component } from 'react'
import { Switch, Route, Link, Redirect } from 'react-router-dom'
import Methone from 'methone'
import * as ROUTES from './routes'

import './App.css'

import Home from './Pages/Home/Home'
import Historia from './Pages/Historia/Historia'
import Admin from './Pages/Admin/Admin'
import CreateEvent from './Pages/CreateEvent/CreateEvent'
import Museum from './Pages/Museum/Museum'
import PatchArchive from './Pages/PatchArchive/PatchArchive'
import PatchDetailed from './Pages/PatchDetailed/PatchDetailed'
import AdminPatchCreate from './Pages/Admin/AdminPatchCreate'
import NotFound from './components/NotFound'
import AdminTags from './Pages/Admin/AdminTags'
import AdminEvents from './Pages/Admin/AdminEvents'
import ProtectedContent from './components/ProtectedContent'
import EventDetailed from './Pages/CreateEvent/EventDetailed'
import AdminProtected, {AdminPrylisProtected, PrylisAdminProtected} from './components/AdminProtected'
import AdminPatchEdit from './Pages/Admin/AdminPatchEdit'
import AdminOrder from './Pages/Admin/AdminOrder'

class App extends Component {
  constructor(props) {
    super(props)

    const links = [
      {to: ROUTES.HOME, text: "Hem"},
      {to: ROUTES.TIDSLINJE, text: "Tidslinje"},
      {to: ROUTES.MUSEUM, text: "Museum"},
      {to: ROUTES.MÄRKESARKIV, text: "Märkesarkiv"},
      {to: ROUTES.SKAPA_HÄNDELSE, text: "Skapa händelse"},
    ]

    this.state = {
      pls: [],
      adminFetchDone: false,
      methoneLinks: links.map((x,i) => <Link key={"link-"+i} to={x.to}>{x.text}</Link>)
    }
  }

  componentDidMount() {
    if (localStorage.getItem('token')) {
      fetch(`${ROUTES.API_IS_ADMIN}?token=${localStorage.getItem('token')}`)
      .then(res => res.json())
      .then(json => {
        if (json.error) {
          localStorage.removeItem('token')
          window.location=ROUTES.HOME
        } else {
          this.setState({pls: json.pls, adminFetchDone: true})
          if ((this.state.pls.includes("admin") || this.state.pls.includes("prylis")) && localStorage.getItem('token')) {
            this.setState({
              methoneLinks: this.state.methoneLinks.concat(<Link key="link-admin" to={ROUTES.ADMIN}>Administrera</Link>)
            })
          }
        }
      })
      .catch(err => {
        console.log(err)
        // window.location=ROUTES.LOGIN
      })
    }
  }

  render() {

    return (
      <div className="App">
        <Methone config={{
          system_name: 'damm',
          color_scheme: 'cerise',
          links: this.state.methoneLinks,
          login_text: localStorage.getItem('token') ? "Logga ut" : "Logga in",
          login_href: localStorage.getItem('token') ? "/logout" : "/login"
        }} />
        <div className="MethoneSpan"></div>
        <Switch>
          <Route exact path={ROUTES.HOME} render={match => <Home {...this.props} {...this.state} /> } />
          <Route exact path={ROUTES.TIDSLINJE} render={match => <Historia {...this.props} {...this.state} /> } />
          <Route exact path={ROUTES.MUSEUM} render={match => <Museum {...this.props} {...this.state} /> } />
          <Route exact path={ROUTES.MÄRKESARKIV} render={match => <PatchArchive {...this.props} {...this.state} {...match}/> } />
          <Route exact path={ROUTES.MÄRKE} render={match => <ProtectedContent allowNoLogin={true} contentURL={[`${ROUTES.API_GET_PATCH}${match.match.params.id}?token=${localStorage.getItem("token") ? localStorage.getItem("token") : ""}`]} {...match}>
            <PatchDetailed {...this.props} {...this.state} {...match} /> 
          </ProtectedContent>} />
          <Route exact path={ROUTES.SKAPA_MÄRKE} render={match => <AdminPrylisProtected component={AdminPatchCreate} {...this.props} {...this.state} />} />
          <Route exact path={ROUTES.REDIGERA_MÄRKE} render={match => <ProtectedContent contentURL={[`${ROUTES.API_GET_PATCH}${match.match.params.id}?token=${localStorage.getItem("token")}`, ROUTES.API_GET_TAGS]}>
            <AdminPatchEdit />
          </ProtectedContent>} />
          <Route exact path={ROUTES.ORDER} render={match => <AdminPrylisProtected component={AdminOrder} {...this.props} {...this.state} />} />
          <Route exact path={ROUTES.MÄRKESTAGGAR} render={match => <AdminPrylisProtected component={AdminTags} {...this.props} {...this.state} mode="edit"/>} />
          <Route exact path={ROUTES.SKAPA_HÄNDELSE} render={match => <CreateEvent {...this.props} {...this.state} /> } />
          <Route exact path={ROUTES.HANTERA_HÄNDELSER} render={match => <AdminProtected component={AdminEvents} {...this.props} {...this.state} /> } />
          <Route exact path={ROUTES.EVENT} render={match =>
            <ProtectedContent contentURL={[`${ROUTES.API_GET_EVENT}/${match.match.params.id}?token=${localStorage.getItem("token" || "")}`]}>
              <EventDetailed {...this.props} {...this.state} {...match}/>
            </ProtectedContent>}
          />
          <Route exact path={ROUTES.ADMIN} render={match => <AdminPrylisProtected component={Admin} {...this.props} {...this.state} /> } />
          <Route exact path={ROUTES.LOGIN} render={match => {window.location = `https://login.datasektionen.se/login?callback=${encodeURIComponent(window.location.origin)}/token/` }} />
          <Route exact path={ROUTES.LOGOUT} render={({match}) => {
            localStorage.removeItem('token')
            // history.push(ROUTES.HOME)
            window.location=ROUTES.HOME
          }} />
          <Route path={ROUTES.TOKEN} render={({match, history}) => {
            localStorage.setItem('token', match.params.token)
            return <Redirect to={ROUTES.HOME} />
            // window.location=ROUTES.HOME
          }} />
          <Route path="*" render={match => <NotFound />} />
        </Switch>
      </div>
    )
  }
}

export default App
