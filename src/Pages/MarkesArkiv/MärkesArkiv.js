import React from 'react'
import logo from '../../skold.png'
import './MärkesArkiv.css'
import Märke from './Märke'

import Sektionmärket from './Sektionsmärket.jpg'
import Sjöslaget from './Sjöslaget 2010.jpg'
import metadorerna from './metadorerna.jpg'
import pung from './PUNG.jpg'
import starkt from './starkt.jpg'

import moment from 'moment'
import Add from './add.png'
import TagClickable from './TagClickable'

class MärkesArkiv extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            tags: [],
            filterTagsQuery: "",
            selectedTags: [],
            search: ""
        }
    }

    componentDidMount() {
        const fetchTags = () => {
            fetch('/api/tags')
            .then(res => res.json())
            .then(res => {
                console.log(res)
                this.setState({tags: res})
            })
            .catch(err => {
                console.log(err)
            })
        }
        
        fetchTags()
    }

    render() {

        const filterTags = (e) => {
            this.setState({filterTagsQuery: e.target.value})
        }

        const toggleTag = (tag) => {
            //Remove from list
            if (this.state.selectedTags.includes(tag.text)) {
                this.setState({selectedTags: this.state.selectedTags.filter(x => x !== tag.text)})
             //Add it to the list
            } else {
                this.setState({selectedTags: this.state.selectedTags.concat(tag.text)})
            }
        }

        const doSearch = (e) => {
            this.setState({search: e.target.value})
        }

        return (
            <div>
                <div className="Header">
                    <div>
                        <img src={logo} alt="Datasektionens sköld" className="Logo" />
                        <h1>Konglig Datasektionens</h1>
                        <h2>Märkesarkiv</h2>
                    </div>
                </div>
                <div className="settings">
                    <div className="sök">
                        <input type="text" placeholder="Sök..." value={this.state.search} onChange={(e) => doSearch(e)}/>
                        <img className="clearImg" src={Add} onClick={() => {this.setState({search: ""})}}/>
                        {/* <button>Sök</button> */}
                    </div>
                    <div className="filter">
                        <input type="text" placeholder="Taggar" onChange={(e) => filterTags(e)} value={this.state.filterTagsQuery} />
                        <img className="clearImg" src={Add} onClick={() => {this.setState({filterTagsQuery: ""})}}/>
                        <button onClick={() => {this.setState({selectedTags: []})}} disabled={this.state.selectedTags.length === 0}>Clear tags</button>
                        <div className="tagQueryResult">
                            {this.state.tags.map((x,i) => x.text.toLowerCase().match(new RegExp(this.state.filterTagsQuery.toLowerCase(), "g")) ? <TagClickable key={i} onClick={() => {toggleTag(x)}} {...x} selectedTags={this.state.selectedTags}/> : undefined)}
                        </div>
                    </div>
                </div>
                <div className="märken">
                    <Märke
                        image={Sektionmärket}
                        title="Konglig Datasektionens sektionsmärke"
                        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer augue lacus, congue et ex euismod, malesuada consectetur elit. Ut euismod, ligula eu egestas aliquet, tellus ipsum luctus tortor, in rutrum mi tortor ac sem. Vestibulum tempor varius ultricies. Quisque vitae erat dolor. Etiam ac risus et mi eleifend scelerisque. Sed volutpat venenatis erat in pellentesque. Donec eros lorem, dapibus et purus sed, faucibus fermentum lorem."
                        date={moment(Date.now())}
                        numProduced={100}
                        price="10"
                        tags={[{text: "Gasque", hoverText: "Override test"}, {text: "2020", backgroundColor: "#b3b1ed", color: "black"}, {text: "Sektionen", backgroundColor: "#1d76db", color: "white"}, {text: "dfunk", backgroundColor: "#d93f0b", color: "white"}]}
                    />
                    <Märke
                        image={Sjöslaget}
                        title="Sjöslaget 2010 testar ett extra långt namn långt ord Flaggstångsknoppsputsmedel testar ett extra långt namn långt ord Flaggstångsknoppsputsmedel"
                        description=""
                        date={moment(new Date('October 17, 2010 03:24:00'))}
                        numProduced={100}
                    />
                    <Märke
                        image={pung}
                        title="PUNG"
                        description=""
                        date={moment(new Date('March 17, 2008 03:24:00'))}
                        numProduced={100}
                        price="15"
                    />
                    <Märke
                        image={metadorerna}
                        title="Metadorerna"
                        description=""
                        date={moment(new Date('May 3, 2013 03:24:00'))}
                        price="20"
                        numProduced={100}
                    />
                    <Märke
                        image={starkt}
                        title="Starkt är vackert"
                        description=""
                        date={moment(new Date('September 24, 2009 03:24:00'))}
                        price="15"
                        numProduced={100}
                    />
                    <Märke
                        image={Sjöslaget}
                        title="Sjöslaget 2010"
                        description=""
                        date={moment(new Date('October 17, 2010 03:24:00'))}
                        numProduced={100}
                    />
                </div>
            </div>
        )
    }
}

export default MärkesArkiv