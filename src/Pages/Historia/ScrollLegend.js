import React, { Component } from 'react'
import './ScrollLegend.css'

class ScrollLegend extends Component {
  constructor(props) {
    super(props)

    // Set default state
    this.state = {
      scrollTop: Math.max(document.body.scrollTop, document.documentElement.scrollTop),
      year: '',
      positions: {},
      documentHeight: 1,
      firstRendered: false
    }
  }

  componentWillReceiveProps(nextProps) {
    const init = _ => {
      this.updatePositions()
      document.body.onscroll = _ => this.onScroll()
      this.onScroll()
      this.makeScrollHandleDraggable()
      this.initTouchHandlers()
    }
    window.onresize = function(event) {
      init()
    }
    setTimeout(init, 500)
  }

  initTouchHandlers() {
    const touchHandler = event => {
        const touches = event.changedTouches
        const first = touches[0]
        let type = ""

        switch(event.type) {
            case "touchstart": type = "mousedown"; break;
            case "touchmove":  type = "mousemove"; break;        
            case "touchend":   type = "mouseup";   break;
            default:           return;
        }

        const simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                                      first.screenX, first.screenY, 
                                      first.clientX, first.clientY, false, 
                                      false, false, false, 0, null);

        first.target.dispatchEvent(simulatedEvent);
        event.preventDefault();
    }

    document.addEventListener("touchstart", touchHandler, true)
    document.addEventListener("touchmove", touchHandler, true)
    document.addEventListener("touchend", touchHandler, true)
    document.addEventListener("touchcancel", touchHandler, true)    
  }

  makeScrollHandleDraggable() {
    if (!document || !window) {
      return
    }
    const handle = document.getElementById('ShowYear')
    const documentElement = document.documentElement
    if (!handle || !documentElement) {
      return
    }

    let grippingOffset = 0

    const repositionElement = event => {
      event.stopPropagation()
      event.preventDefault()

      const newScroll = (event.clientY - grippingOffset) / documentElement.clientHeight * (1/0.95) * this.state.documentHeight
      window.scrollTo(0, newScroll)
      window.onscroll()
    }

    handle.addEventListener('mousedown', event => {
      grippingOffset = event.offsetY
      documentElement.addEventListener('mousemove', repositionElement, false)

      window.addEventListener('mouseup', _ => {
        documentElement.removeEventListener('mousemove', repositionElement, false)
      }, false)
    }, false)
  }

  onScroll() {
    let year = ''
    for (let i = 0; i < this.props.years.length - 1; i++) {
      year = this.props.years[i].year
      if (this.state.positions[this.props.years[i + 1].year] - 50 > this.state.scrollTop + 50) {
        break
      }
    }

    this.setState({
      scrollTop: Math.max(
        document.body.scrollTop, 
        document.documentElement.scrollTop
      ),
      documentHeight: Math.max(
        document.body.scrollHeight, 
        document.body.offsetHeight, 
        document.documentElement.clientHeight, 
        document.documentElement.scrollHeight, 
        document.documentElement.offsetHeight
      ),
      year: year
    })
  }

  /**
   * Update the positions list of the different years.
   * @return void
   */
  updatePositions() {
    // Lambda function for getting position of year
    const position = year => {
      if (!document || !window) {
        return 0
      }
      const element = document.getElementById('year-' + year)
      if (!element) {
        return 0
      }
      const elementPos = element.getBoundingClientRect().top + window.scrollY
      return elementPos
    }

    // Loop through the years and save their position
    const positions = {}
    this.props.years.forEach(year => {
      positions[year.year] = position(year.year)
    })

    this.setState({ positions })
  }

  goTo(year) {
    const topBarHeight = 50

    if (!window || !document) {
      return
    }

    const element = document.getElementById('year-' + year)
    if (!element) {
      return
    }

    window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - topBarHeight)
    window.onscroll()
  }

  render() {
    if (this.props.years.length === 0) {
      return (<div></div>)
    }

    const { year, positions, documentHeight, scrollTop } = this.state
    return (
      <div className="ScrollLegend">
        <div className="ShowYear" id="ShowYear" style={{top: "calc(50px + " + scrollTop / documentHeight * 95 + '%)'}}>{ year }</div>
        { this.props.years.map(year => (
          <div key={'year-' + year.year} className="Year" onClick={e => this.goTo(year.year)} style={{top: "calc(50px + " + positions[year.year] / documentHeight * 95 + '%)'}}>{ year.year }</div> 
        )) }
      </div>
    )
  }
}

export default ScrollLegend
