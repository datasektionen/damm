import React from 'react'
import logo from '../../skold.png'
import './MärkesArkiv.css'
import Märke from './components/Märke'
import * as ROUTES from '../../routes'

import moment from 'moment'
import Add from '../../components/add.png'
import TagClickable from '../../components/TagClickable'

class MärkesArkiv extends React.Component {
    constructor(props) {
        super(props)

        let showTags = false
        if (typeof(Storage) !== 'undefined' && localStorage.getItem('showTags')) {
          try {
          showTags = JSON.parse(localStorage.getItem('showTags'))
          } catch (e) {}
        }

        this.state = {
            tags: [],
            filterTagsQuery: "",
            selectedTags: [],
            search: "",
            märken: [],
            showTags: showTags,
            numPatches: 0,
            sortRule: "standard",
            file: undefined,
        }
    }

    componentDidMount() {
        const fetchTags = () => {
            fetch(ROUTES.API_GET_TAGS)
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
            fetch(ROUTES.API_GET_MÄRKEN)
            .then(res => res.json())
            .then(res => {
                console.log(res)
                this.setState({märken: res, numPatches: res.length})
            })
            .catch(err => {
                console.log(err)
            })
        }
        
        fetchTags()
        fetchMärken()
    }

    render() {

        const selectedTagsIncludesTag = (tagName) => {
            return this.state.selectedTags.filter(x => x.text === tagName).length > 0
        }

        //Function called when clicking on a tag in the filter section. Adds and removes a tag from the selected tags list.
        const toggleTag = (tag) => {
            //Remove from list
            if (selectedTagsIncludesTag(tag.text)) {
                this.setState({selectedTags: this.state.selectedTags.filter(x => x.text !== tag.text)})
            } else { //Add
                this.setState({selectedTags: this.state.selectedTags.concat(tag)})
            }
        }

        //Function which checks if a patch's tags matches any we have selected.
        const patchTagsMatchesSelected = (märke) => {
            const {tags} = märke

            //If no tags are selected, show all patches
            if (this.state.selectedTags.length === 0) return true
            //Past the if statement above, we know we have selected at least one tag.

            //If patch has no tags, do not match
            if (tags.length === 0) return false
    
            //Returns an array with booleans where each boolean represents a tag match.
            const hits = tags.map((x,i) => {
                if (selectedTagsIncludesTag(x.text)) return true
                else return false
            })

            let tagMatches
            //Could just do hits[0] + 0 since true + 0 = 1 and false + 0 = 0, but you never know with js
            //This line is because of reduce, when you reduce an array with one element, it only takes the accumulator value.
            if (hits.length === 1) tagMatches = hits[0] === true ? 1 : 0
            //true + true = 2, true + false = 1 and so on, but I do this below to be more clear
            else tagMatches = hits.reduce((acc, curr) => acc + (curr === true ? 1 : 0))
            return tagMatches === this.state.selectedTags.length
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
        
        //Shows/hides tags and saves the state to localstorage
        const toggleShowTags = () => {
            this.setState({showTags: !this.state.showTags}, () => {
                localStorage.setItem('showTags', JSON.stringify(this.state.showTags));
            })
        }
        
        //Array of sort options
        const sortOptions = ["Sortera på: Standard", "Namn (A-Ö)", "Namn (Ö-A)", "Pris (Lägst överst)", "Pris (Högst överst)", "Datum (Nu-1983)", "Datum (1983-Nu)"]

        //Function that sorts results
        const sortResults = () => {
            const {sortRule} = this.state
            
            if (sortRule === sortOptions[0].toLowerCase()) return this.state.märken

            if (sortRule === sortOptions[1].toLowerCase()) {
                return [...this.state.märken].sort((a, b) => {
                    const A = a.name.toLowerCase()
                    const B = b.name.toLowerCase()
                    if (A < B) return -1
                    if (A > B) return 1
                    return 0
                })
            }

            if (sortRule === sortOptions[2].toLowerCase()) {
                return [...this.state.märken].sort((a, b) => {
                    const A = a.name.toLowerCase()
                    const B = b.name.toLowerCase()
                    if (A > B) return -1
                    if (A < B) return 1
                    return 0
                })
            }

            if (sortRule === sortOptions[3].toLowerCase()) {
                return [...this.state.märken].sort((a, b) => {
                    const A = a.price.toLowerCase()
                    const B = b.price.toLowerCase()
                    if (A < B) return -1
                    if (A > B) return 1
                    return 0
                })
            }

            if (sortRule === sortOptions[4].toLowerCase()) {
                return [...this.state.märken].sort((a, b) => {
                    const A = a.price.toLowerCase()
                    const B = b.price.toLowerCase()
                    if (A > B) return -1
                    if (A < B) return 1
                    return 0
                })
            }

            if (sortRule === sortOptions[5].toLowerCase()) {
                return [...this.state.märken].sort((a, b) => new moment(a.date).format('YYYYMMDD') - new moment(b.date).format('YYYYMMDD'))
            }

            if (sortRule === sortOptions[6].toLowerCase()) {
                return [...this.state.märken].sort((a, b) => new moment(b.date).format('YYYYMMDD') - new moment(a.date).format('YYYYMMDD'))
            }

            return this.state.märken
        }

        return (
            <div className="MärkesArkiv">
                <div className="Header">
                    <div>
                        <img src={logo} alt="Datasektionens sköld" className="Logo" />
                        <h1>Konglig Datasektionens</h1>
                        <h2>Märkesarkiv</h2>
                    </div>
                </div>
                <div className="settings">
        <h3>Sök bland {this.state.numPatches} märken</h3>
                    <div className="buttons">
                        <button onClick={() => {this.setState({selectedTags: []})}} disabled={this.state.selectedTags.length === 0}>Rensa taggar</button>
                        <button onClick={() => clearAll()} disabled={this.state.selectedTags.length === 0 && this.state.search.length === 0}>Rensa allt</button>
                        <button onClick={() => toggleShowTags()}>{this.state.showTags ? "Göm taggar" : "Visa taggar"}</button>
                    </div>
                    <div className="sök">
                        <input type="text" placeholder="Sök..." value={this.state.search} onChange={(e) => this.setState({search: e.target.value})}/>
                        <img className="clearImg" src={Add} onClick={() => {this.setState({search: ""})}}/>
                        <select name="sortera" onChange={(e) => this.setState({sortRule: e.target.value})}>
                            {sortOptions.map((x, i) => <option key={i} value={x.toLowerCase()}>{x}</option>)}
                        </select>
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
                    {sortResults().map((x,i) => (patchTagsMatchesSelected(x) && matchesSearch(x)) ? <Märke key={i} {...x} /> : undefined)}
                </div>
            </div>
        )
    }
}

export default MärkesArkiv