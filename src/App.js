import React, { Component } from 'react'
import './App.css'
import Historia from './Pages/Historia/Historia'
import Admin from './Pages/Admin/Admin'
import Methone from 'methone'
import { Switch, Route, Redirect, Link } from 'react-router-dom'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      token: localStorage.getItem('token'),
      isAdmin: true,
    }
  }

  methoneLinks = () => {
    let links = [
      <Link to="/">Tidslinje</Link>,
      <Link to="/skapa">Skapa händelse</Link>,
      <Link to="/museum">Historiska Artefakter</Link>,
    ]

    if (this.state.isAdmin && this.state.token) links.push(<Link to="/admin">Admin</Link>)

    return links
  }

  render() {  
    console.log(this.methoneLinks())
    return (
      <div className="App">
        <Methone config={{
          system_name: 'damm',
          color_scheme: 'cerise',
          links: this.methoneLinks(),
          login_text: this.state.token ? "Logga ut" : "Logga in",
          login_href: this.state.token ? "/logout" : "/login"
        }} />
        <div className="MethoneSpan"></div>
        <Switch>
          <Route exact path="/" render={match => <Historia {...this.props} {...this.state} /> } />
          <Route exact path='/admin' render={match => <Admin {...this.props} {...this.state} />} />
          <Route exact path='/login' render={match => {window.location = `https://login2.datasektionen.se/login?callback=${encodeURIComponent(window.location.origin)}/token/` }} />
          <Route exact path='/logout' render={({match}) => {
            localStorage.removeItem('token')
            this.setState({token: ""})
            return <Redirect to='/' />
          }} />
          <Route path='/token/:token' render={({match}) => {
            localStorage.setItem('token', match.params.token)
            this.setState({token: match.params.token})
            //TODO: Fetch if is admin here
            //i.e. fetch pls, setState({isAdmin: response from pls})
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
