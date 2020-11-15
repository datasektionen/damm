import React, { Component } from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import Methone from 'methone'
import * as ROUTES from './routes'

import './App.css'

import Historia from './Pages/Historia/Historia'
import Admin from './Pages/Admin/Admin'
import CreateEvent from './Pages/CreateEvent/CreateEvent'
import Museum from './Pages/Museum/Museum'
import PatchArchive from './Pages/PatchArchive/PatchArchive'
import PatchDetailed from './Pages/PatchDetailed/PatchDetailed'
import AdminPatch from './Pages/Admin/AdminPatch'
import NotFound from './components/NotFound'
import AdminTags from './Pages/Admin/AdminTags'
import AdminEvents from './Pages/Admin/AdminEvents'
import ProtectedContent from './Pages/CreateEvent/ProtectedContent'
import EventDetailed from './Pages/CreateEvent/EventDetailed'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      pls: [],
    }
  }

  componentDidMount() {
    if (localStorage.getItem('token')) {
      fetch(`${ROUTES.API_IS_ADMIN}?token=${localStorage.getItem('token')}`)
      .then(res => res.json())
      .then(json => {
        console.log(json)
        if (json.error) {
          localStorage.removeItem('token')
          // TODO: Replace with this.props.history.push
          window.location=ROUTES.HOME
        } else {
          this.setState({pls: json.pls})
          // this.setState({admin: json.isAdmin})
        }
      })
      .catch(err => {
        console.log(err)
        // window.location=ROUTES.LOGIN
      })
    }
  }

  render() {

    const methoneLinks = () => {
      let links = [
        <Link to={ROUTES.HOME}>Tidslinje</Link>,
        <Link to={ROUTES.MUSEUM}>Historiska artefakter</Link>,
        <Link to={ROUTES.MÄRKESARKIV}>Märkesarkiv</Link>,
        <Link to={ROUTES.SKAPA_HÄNDELSE}>Skapa händelse</Link>
      ]
      
      // if (localStorage.getItem('token')) links.push(<Link to={ROUTES.SKAPA_HÄNDELSE}>Skapa händelse</Link>)
      if ((this.state.pls.includes("admin") || this.state.pls.includes("prylis")) && localStorage.getItem('token')) links.push(<Link to={ROUTES.ADMIN}>Administrera</Link>)

      // links.push(<Link to={ROUTES.HELP}>Hjälp</Link>)
      return links
    }

    return (
      <div className="App">
        <Methone config={{
          system_name: 'damm',
          color_scheme: 'cerise',
          links: methoneLinks(),
          login_text: localStorage.getItem('token') ? "Logga ut" : "Logga in",
          login_href: localStorage.getItem('token') ? "/logout" : "/login"
        }} />
        <div className="MethoneSpan"></div>
        <Switch>
          <Route exact path={ROUTES.HOME} render={match => <Historia {...this.props} {...this.state} /> } />
          <Route exact path={ROUTES.MUSEUM} render={match => <Museum {...this.props} {...this.state} /> } />
          <Route exact path={ROUTES.MÄRKESARKIV} render={match => <PatchArchive {...this.props} {...this.state} {...match}/> } />
          <Route exact path={ROUTES.MÄRKE} render={match => <ProtectedContent contentURL={`${ROUTES.API_GET_PATCH}${match.match.params.id}`}>
            <PatchDetailed {...this.props} {...this.state} {...match} /> 
          </ProtectedContent>} />
          <Route exact path={ROUTES.SKAPA_MÄRKE} render={match => <AdminPatch {...this.props} {...this.state} />} />
          <Route exact path={ROUTES.MÄRKESTAGGAR} render={match => <AdminTags {...this.props} {...this.state} />} />
          <Route exact path={ROUTES.SKAPA_HÄNDELSE} render={match => <CreateEvent {...this.props} {...this.state} /> } />
          <Route exact path={ROUTES.HANTERA_HÄNDELSER} render={match => <AdminEvents {...this.props} {...this.state} /> } />
          <Route exact path={ROUTES.EVENT} render={match =>
            <ProtectedContent
              contentURL={`${ROUTES.API_GET_EVENT}/${match.match.params.id}?token=${localStorage.getItem("token" || "")}`}
              {...this.props}
              {...this.state}
              {...match}
            >
              <EventDetailed />
            </ProtectedContent>}
          />
          <Route exact path={ROUTES.ADMIN} render={match => <Admin {...this.props} {...this.state} />} />
          <Route exact path={ROUTES.LOGIN} render={match => {window.location = `https://login2.datasektionen.se/login?callback=${encodeURIComponent(window.location.origin)}/token/` }} />
          <Route exact path={ROUTES.LOGOUT} render={({match}) => {
            localStorage.removeItem('token')
            window.location=ROUTES.HOME
          }} />
          <Route path={ROUTES.TOKEN} render={({match}) => {
            localStorage.setItem('token', match.params.token)
            window.location=ROUTES.HOME
          }} />
          <Route path="*" render={match => <NotFound />} />
        </Switch>
      </div>
    )
  }
}

export default App
