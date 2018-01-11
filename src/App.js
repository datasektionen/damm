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
    this.state = {
      events: [],
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

    fetch('http:/'+'/192.168.1.165:5000')
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
      switch (card.template) {
        case 'dfunkt': return <DFunkt  order={i} data={card} key={'card-' + i} />
        case 'sm'    : return <SM      order={i} data={card} key={'card-' + i} />
        default      : return <General order={i} data={card} key={'card-' + i} />
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
