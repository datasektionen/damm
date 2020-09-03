import React, { Component } from 'react'
import { Switch, Route, Redirect, Link } from 'react-router-dom'
import Methone from 'methone'
import * as ROUTES from './routes'

import './App.css'

import Historia from './Pages/Historia/Historia'
import Admin from './Pages/Admin/Admin'
import SkapaHändelse from './Pages/SkapaHändelse/SkapaHändelse'
import Museum from './Pages/Museum/Museum'
import MärkesArkiv from './Pages/MarkesArkiv/MärkesArkiv'
import MärkePage from './Pages/MarkesArkiv/MärkePage'
import AdminMärke from './Pages/Admin/AdminMärke'
import NotFound from './Pages/NotFound'
import AdminTags from './Pages/Admin/AdminTags'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      admin: false
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
          window.location=ROUTES.HOME
        } else {
          // localStorage.setItem('isAdmin', json.isAdmin)
          this.setState({admin: json.isAdmin})
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
      ]
      
      if (localStorage.getItem('token')) links.push(<Link to={ROUTES.SKAPA_HÄNDELSE}>Skapa händelse</Link>)
      if (this.state.admin === true && localStorage.getItem('token')) links.push(<Link to={ROUTES.ADMIN}>Administrera</Link>)

      links.push(<Link to={ROUTES.HELP}>Hjälp</Link>)
      return links
    }

    console.log(methoneLinks())

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
          <Route exact path={ROUTES.MÄRKESARKIV} render={match => <MärkesArkiv {...this.props} {...this.state} /> } />
          <Route exact path={ROUTES.MÄRKE} render={match => <MärkePage /> } />
          <Route exact path={ROUTES.SKAPA_MÄRKE} render={match => <AdminMärke {...this.props} {...this.state} />} />
          <Route exact path={ROUTES.MÄRKESTAGGAR} render={match => <AdminTags {...this.props} {...this.state} />} />
          <Route exact path={ROUTES.SKAPA_HÄNDELSE} render={match => <SkapaHändelse {...this.props} {...this.state} /> } />
          <Route exact path={ROUTES.ADMIN} render={match => <Admin {...this.props} {...this.state} />} />
          <Route exact path={ROUTES.LOGIN} render={match => {window.location = `https://login2.datasektionen.se/login?callback=${encodeURIComponent(window.location.origin)}/token/` }} />
          <Route exact path={ROUTES.LOGOUT} render={({match}) => {
            localStorage.removeItem('token')
            window.location=ROUTES.HOME
            // return <Redirect to={ROUTES.HOME} />
          }} />
          <Route path={ROUTES.TOKEN} render={({match}) => {
            localStorage.setItem('token', match.params.token)
            window.location=ROUTES.HOME
            // return <Redirect to={ROUTES.HOME} />
          }} />
          {/* TODO: Fixa en dammig 404-komponent */}
          <Route path="*" render={match => <NotFound />} />
        </Switch>
      </div>
    )
  }
}

export default App
