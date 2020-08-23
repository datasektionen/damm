import React, { Component } from 'react'
import './App.css'
import Historia from './Pages/Historia/Historia'
import Admin from './Pages/Admin/Admin'
import SkapaHändelse from './Pages/SkapaHändelse/SkapaHändelse'
import Methone from 'methone'
import { Switch, Route, Redirect, Link } from 'react-router-dom'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  componentDidMount() {
    if (localStorage.getItem('token') && !localStorage.getItem('isAdmin')) {
      fetch(`/api/isAdmin?token=${localStorage.getItem('token')}`)
      .then(res => res.json())
      .then(json => {
        console.log(json)
        localStorage.setItem('isAdmin', json.isAdmin)
      })
    }
  }

  render() {

    const methoneLinks = () => {
      let links = [
        <Link to="/">Tidslinje</Link>,
        <Link to="/skapa-handelse">Skapa händelse</Link>,
        <Link to="/museum">Historiska Artefakter</Link>,
      ]

      if (localStorage.getItem('isAdmin') === true && localStorage.getItem('token')) links.push(<Link to="/admin">Admin</Link>)

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
          <Route exact path="/" render={match => <Historia {...this.props} {...this.state} /> } />
          <Route exact path="/skapa-handelse" render={match => <SkapaHändelse {...this.props} {...this.state} /> } />
          <Route exact path='/admin' render={match => <Admin {...this.props} {...this.state} />} />
          <Route exact path='/login' render={match => {window.location = `https://login2.datasektionen.se/login?callback=${encodeURIComponent(window.location.origin)}/token/` }} />
          <Route exact path='/logout' render={({match}) => {
            localStorage.removeItem('token')
            localStorage.removeItem('isAdmin')
            return <Redirect to='/' />
          }} />
          <Route path='/token/:token' render={({match}) => {
            localStorage.setItem('token', match.params.token)
            return <Redirect to='/' />
          }} />
          {/* TODO: Fixa en 404-komponent */}
          <Route path="*" render={match => <div>Sidan hittades ej</div>} />
        </Switch>
      </div>
    )
  }
}

export default App
