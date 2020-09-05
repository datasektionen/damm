import React from 'react'
import moment from 'moment'
import '../../App.css'
import logo from '../../skold.png'
import ScrollLegend from './ScrollLegend'
import templates from '../../config/templates'

import General from './cards/General'
import Anniversary from './cards/Anniversary'

class Historia extends React.Component {
    constructor(props) {
        super(props)

        let show = Object.keys(templates)
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
            return templates[card.template].template(card, i)
          }
      
        const changeState = e => {
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
            <div>
                <div className="Header">
                    <div>
                        <img src={logo} alt="Datasektionens sköld" className="Logo" />
                        <h1>Konglig Datasektionens</h1>
                        <h2>Sektionshistoria</h2>
                    </div>
                </div>
                <ScrollLegend years={this.state.years} events={this.state.events} />
                <div className="Filter">
                <h5 onClick={x => this.setState({showFilter: !this.state.showFilter})}>Filtrera <i className="fa fa-filter"></i></h5>
                <ul style={ this.state.showFilter ? {display: 'inline-block'} : {display: 'none'} }>
                    {
                    Object.keys(templates).map(templateId => (
                        <li key={'filter-' + templateId}>
                        <div className="checkbox">
                            <input type="checkbox" name={templateId + '-filter'} id={templateId + '-filter'} checked={this.state.show.includes(templateId)} onChange={changeState} />
                            <label htmlFor={templateId + '-filter'}>{templates[templateId].title}</label>
                        </div>
                        </li>
                    ))
                    }
                </ul>
                </div>
                <div className="Timeline">
                  {/* Ta bort detta, mockdata */}
                  <div key={'year-heading-' + 2021} id={'year-' + 2021}>
                    <time className="Year">{ 2021 }</time>
                    <div className="cards">
                      <Anniversary data={{date: moment(new Date('October 7, 2021 00:00:00')), order: 0, title: "Konglig Datasektionen fyller 38 år"}} />
                      <General data={{date: moment(Date.now()), order: 1, title: "Generell historia-test", content:'### Det var en gång en gubbe, som bodde i en stubbe\n Markdownsupport :O \n\nVårbalen 2019 var en bra jävla bal'}}/>
                    </div>
                  </div>
                  {/* Ta bort ovan, mockdata */}
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

export default Historia