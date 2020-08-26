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
            search: "",
            märken: [],
            showTags: false,
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

        const fetchMärken = () => {
            fetch('/api/marken')
            .then(res => res.json())
            .then(res => {
                console.log(res)
                this.setState({märken: res})
            })
            .catch(err => {
                console.log(err)
            })
        }
        
        fetchTags()
        fetchMärken()
    }

    render() {

        //Function called when clicking on a tag in the filter section. Adds and removes a tag from the selected tags list.
        const toggleTag = (tag) => {
            //Remove from list
            if (this.state.selectedTags.includes(tag.text)) {
                this.setState({selectedTags: this.state.selectedTags.filter(x => x !== tag.text)})
             //Add it to the list
            } else {
                this.setState({selectedTags: this.state.selectedTags.concat(tag.text)})
            }
        }

        //Function which checks if a patch's tags matches any we have selected.
        const hasTagsSelected = (märke) => {

            //If no tags are selected, show all patches
            if (this.state.selectedTags.length === 0) return true

            const {tags} = märke
    
            const hits = tags.map(x => {
                if (this.state.selectedTags.includes(x.text)) return true
                else return false
            })

            //If there is one true in the list, we have a match and we should show the patch.
            //TODO: If you select several tags, do we want them to "add up" i.e. only show the patches with those combinations of tags,
            //or simply just show the patches who has any of those tags?
            return hits.includes(true)
        }

        //Function which checks if a patch matches the search query
        const matchesSearch = (märke) => {
            if (this.state.search.length === 0) return true
            if (märke.name.toLowerCase().match(new RegExp(this.state.search.toLowerCase(), "g"))) return true
            else return false
        }

        //Clears both selected tags and search query
        const clearAll = () => {
            this.setState({search: "", selectedTags: []})
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
                    <h3>Filtrera märken</h3>
                    <div className="buttons">
                        <button onClick={() => {this.setState({selectedTags: []})}} disabled={this.state.selectedTags.length === 0}>Rensa taggar</button>
                        <button onClick={() => clearAll()} disabled={this.state.selectedTags.length === 0 && this.state.search.length === 0}>Rensa allt</button>
                        <button onClick={() => {this.setState({showTags: !this.state.showTags})}}>{this.state.showTags ? "Göm taggar" : "Visa taggar"}</button>
                    </div>
                    <div className="sök">
                        <input type="text" placeholder="Sök..." value={this.state.search} onChange={(e) => this.setState({search: e.target.value})}/>
                        <img className="clearImg" src={Add} onClick={() => {this.setState({search: ""})}}/>
                    </div>
                    {this.state.showTags ? 
                        <div>
                            <div className="filter">
                                <input type="text" placeholder="Filtrera taggar" onChange={(e) => this.setState({filterTagsQuery: e.target.value})} value={this.state.filterTagsQuery} />
                                <img className="clearImg" src={Add} onClick={() => {this.setState({filterTagsQuery: ""})}}/>
                            </div>
                            <div className="tagQueryResult">
                                {this.state.tags.map((x,i) => x.text.toLowerCase().match(new RegExp(this.state.filterTagsQuery.toLowerCase(), "g")) ? <TagClickable key={i} onClick={() => {toggleTag(x)}} {...x} selectedTags={this.state.selectedTags}/> : undefined)}
                            </div>
                        </div>
                    :
                        undefined
                    }
                </div>
                <div className="märken">
                    {/* <Märke
                        image={Sektionmärket}
                        name="Konglig Datasektionens sektionsmärke"
                        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer augue lacus, congue et ex euismod, malesuada consectetur elit. Ut euismod, ligula eu egestas aliquet, tellus ipsum luctus tortor, in rutrum mi tortor ac sem. Vestibulum tempor varius ultricies. Quisque vitae erat dolor. Etiam ac risus et mi eleifend scelerisque. Sed volutpat venenatis erat in pellentesque. Donec eros lorem, dapibus et purus sed, faucibus fermentum lorem."
                        date={moment(Date.now())}
                        numProduced={100}
                        price="10"
                        tags={this.state.tags}
                    />
                    <Märke
                        image={Sjöslaget}
                        name="Sjöslaget 2010 testar ett extra långt namn långt ord Flaggstångsknoppsputsmedel testar ett extra långt namn långt ord Flaggstångsknoppsputsmedel"
                        description=""
                        date={moment(new Date('October 17, 2010 03:24:00'))}
                        numProduced={100}
                    />
                    <Märke
                        image={pung}
                        name="PUNG"
                        description=""
                        date={moment(new Date('March 17, 2008 03:24:00'))}
                        numProduced={100}
                        price="15"
                    />
                    <Märke
                        image={metadorerna}
                        name="Metadorerna"
                        description=""
                        date={moment(new Date('May 3, 2013 03:24:00'))}
                        price="20"
                        numProduced={100}
                    />
                    <Märke
                        image={starkt}
                        name="Starkt är vackert"
                        description=""
                        date={moment(new Date('September 24, 2009 03:24:00'))}
                        price="15"
                        numProduced={100}
                    />
                    <Märke
                        image={Sjöslaget}
                        name="Sjöslaget 2010"
                        description=""
                        date={moment(new Date('October 17, 2010 03:24:00'))}
                        numProduced={100}
                    /> */}
                    {this.state.märken.map((x,i) => (hasTagsSelected(x) && matchesSearch(x)) ? <Märke key={i} {...x} date={moment(Date.now())} /> : undefined)}
                </div>
            </div>
        )
    }
}

export default MärkesArkiv