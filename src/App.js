import React, { Component } from 'react';
import './App.css';
import logo from './skold.png';
import years from './data.js'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      years: years.years
    }
  }

  componentDidMount() {
    let mandates = []
    fetch('https://dfunkt.datasektionen.se/api/roles')
      .then(res => res.json())
      .then(roles => {
        let promises = []
        for (let i = 0; i < roles.length; i++) {
          let role = roles[i];
          promises.push(fetch('https://dfunkt.datasektionen.se/api/role/' + role.identifier)
            .then(res => res.json())
            .then(role => {
              console.log('-> Got role')
              role.mandates.forEach(mandate => {
                if (!mandates[mandate.start]) {
                  mandates[mandate.start] = []
                }
                mandates[mandate.start].push({
                  user: mandate.User,
                  role: role
                })  
              })
            }))
        }
        Promise.all(promises).then(x => {
          let sortedKeys = []
          for (let key in mandates) {
              sortedKeys[sortedKeys.length] = key
          }
          sortedKeys.sort().reverse()
          let strMonth = (x) => {
            const month = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
            return month[parseInt(x) - 1]
          }
          let years = []
          let lastYear = ''
          sortedKeys.forEach(key => {
            let year = key.substring(0,4)
            let month = key.substring(5,7)
            let day = key.substring(8,10)
            if (years.length === 0 || years[years.length - 1].year != year) {
              years.push({ year: year, cards: [] })
            }
            years[years.length - 1].cards.push({
              day: day,
              month: strMonth(month),
              title: 'Nya funktionärer',
              content: (
                <div>
                  <div class="users">
                    { mandates[key].map((x) => (
                      <div className="crop" style={{backgroundImage: 'url(https://zfinger.datasektionen.se/user/' + x.user.kthid + '/image)'}} />
                    )) }
                  </div>
                  <p>På denna dag tillträdde</p>
                  <ul>
                    { mandates[key].map((x) => (
                      <li>{ x.user.first_name } { x.user.last_name } som { x.role.role.title }</li>
                    )) }
                  </ul>
                </div>
              ),
              tags: ['dFunkt']
            })
          })
          this.setState({years})
          console.log(years)
        })
      })
  }

  render() {
    return (
      <div className="App">
        <div className="Header">
          <div>
            <img src={logo} alt="Datasektionens sköld" className="Logo" />
            <h1>Konglig Datasektionens</h1>
            <h2>Sektionshistoria</h2>
          </div>
        </div>
        <div className="Timeline">
          { this.state.years.map(y => (
            <div key={'year-' + y.year}>
              <time className="Year">{ y.year }</time>
              <div className="cards">
                { y.cards.map((c, i) => (
                <div key={'card-' + y.year + '-' + i} className="card" style={{'order':i}}>
                  <div>
                    <div className="Head">
                      <div className="Date">
                        <div className="Day">{ c.day }</div>
                        <div className="Month">{ c.month }</div>
                      </div>
                      <h2>{ c.title }</h2>
                    </div>
                    { c.content }
                  </div>
                </div>
                )) }
              </div>
            </div>
          )) }
        </div>
      </div>
    );
  }
}

export default App;
