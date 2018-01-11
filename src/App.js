import React, { Component } from 'react'
import moment from 'moment'
import './App.css'
import logo from './skold.png'
import ScrollLegend from './ScrollLegend'
import General from './cards/General'
import DFunkt from './cards/DFunkt'
import SM from './cards/SM'
import Methone from 'methone'

class App extends Component {
  constructor(props) {
    super(props)

    let show = ['dfunkt', 'sm', 'general']
    if (typeof(Storage) !== 'undefined' && localStorage.getItem('show')) {
      try {
      show = JSON.parse(localStorage.getItem('show'))
      } catch (e) {}
    }

    this.state = {
      events: [],
      showFilter: false,
      show: show,
      years: []
    }
  }

  componentDidMount() {
    const eventsPerYear = events => {
      const years = []
      let year = null
      events.forEach(event => {
        if (year === null || year.year !== event.date.year()) {
          if (year !== null) {
            years.push(year)
          }
          year = {
            year: event.date.year(), 
            cards: []
          }
        }
        year.cards.push(event)
      })
      if (year !== null) {
        years.push(year)
      }
      return years
    }

    fetch('/api')
      .then(res => res.json())
      .then(events => {
        events = events.map(e => {
          e.date = moment(e.date)
          return e
        })
        this.setState({events: events, years: eventsPerYear(events)})
      })
  }

  render() {  
    const templateForCard = (card, i) => {
      if (!this.state.show.includes(card.template)) {
        return false
      }
      switch (card.template) {
        case 'dfunkt': return <DFunkt  order={i} data={card} key={'card-' + i} />
        case 'sm'    : return <SM      order={i} data={card} key={'card-' + i} />
        default      : return <General order={i} data={card} key={'card-' + i} />
      }
    }

    const changeState = e => {
      console.log(this.state.show)
      let show = []
      if (!e.target.checked) {
        show = this.state.show.filter(x => x !== e.target.id.substring(0, e.target.id.length - 7))
        this.setState({show})
      } else {
        show = this.state.show
        show.push(e.target.id.substring(0, e.target.id.length - 7))
        this.setState({show})
      }

      if (typeof(Storage) !== 'undefined') {
        localStorage.setItem('show', JSON.stringify(show));
      }
    }

    return (
      <div className="App">
        <Methone config={{ color_scheme: 'black', links: [] }} />
        <div className="MethoneSpan"></div>
        <ScrollLegend years={this.state.years} events={this.state.events} />
        <div className="Header">
          <div>
            <img src={logo} alt="Datasektionens sköld" className="Logo" />
            <h1>Konglig Datasektionens</h1>
            <h2>Sektionshistoria</h2>
          </div>
        </div>
        <div className="Filter">
          <h5 onClick={x => this.setState({showFilter: !this.state.showFilter})}>Filtrera <i className="fa fa-filter"></i></h5>
          <ul style={ this.state.showFilter ? {display: 'inline-block'} : {display: 'none'} }>
            <li>
              <div className="checkbox">
                <input type="checkbox" name="dfunkt-filter" id="dfunkt-filter" checked={this.state.show.includes('dfunkt')} onChange={changeState} />
                <label htmlFor="dfunkt-filter">Funktionärer tillträder</label>
              </div>
            </li>
            <li>
              <div className="checkbox">
                <input type="checkbox" name="sm-filter" id="sm-filter" checked={this.state.show.includes('sm')} onChange={changeState} />
                <label htmlFor="sm-filter">SM &amp; DM</label>
              </div>
            </li>
            <li>
              <div className="checkbox">
                <input type="checkbox" name="general-filter" id="general-filter" checked={this.state.show.includes('general')} onChange={changeState} />
                <label htmlFor="general-filter">Allmän historia</label>
              </div>
            </li>
          </ul>
        </div>
        <div className="Timeline">
          { this.state.years.map(y => (
            <div key={'year-heading-' + y.year} id={'year-' + y.year}>
              <time className="Year">{ y.year }</time>
              <div className="cards">
                { y.cards.map((c, i) => templateForCard(c, i)) }
              </div>
            </div>
          )) }
        </div>
      </div>
    )
  }
}

export default App
