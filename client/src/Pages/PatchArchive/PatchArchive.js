import React from 'react'
import './PatchArchive.css'
import * as ROUTES from '../../routes'
import PatchArchiveView from './PatchArchiveView'
import { PRICE_TYPES } from '../../config/constants'

class PatchArchive extends React.Component {
    constructor(props) {
        super(props)

        let showTags = false
        if (typeof(Storage) !== 'undefined' && localStorage.getItem('showTags')) {
          try {
          showTags = JSON.parse(localStorage.getItem('showTags'))
          } catch (e) {}
        }

        const sortOptions = [
            {text: "Sortera på: Standard", value: "all"},
            {text: "Namn (A-Ö)", value: "name-desc"},
            {text: "Namn (Ö-A)", value: "name-asc"},
            {text: "Pris (Lägst överst)", value: "price-asc"},
            {text: "Pris (Högst överst)", value: "price-desc"},
            {text: "Datum (Nu-1983)", value: "date-desc"},
            {text: "Datum (1983-Nu)", value: "date-asc"},
            {text: "Uppladdningsdatum (Nyast-Äldst)", value: "date-creation-desc"},
            {text: "Uppladdningsdatum (Äldst-Nyast)", value: "date-creation-asc"},
        ]

        const stockFilterOptions = [
            {text: "Lagerstatus: Alla", value: "all"},
            {text: "I lager", value: "true"},
            {text: "Ej i lager", value: "false"},
        ]

        this.state = {
            tags: [],
            filterTagsQuery: "",
            selectedTags: [],
            search: "",
            märken: [],
            showTags: showTags,
            numPatches: 0,
            sortRule: sortOptions[0].value,
            file: undefined,
            sortOptions: sortOptions,
            stockFilter: stockFilterOptions[0].value,
            stockFilterOptions: stockFilterOptions,
            fetching: true,
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
                this.setState({märken: res, numPatches: res.length, fetching: false})
            })
            .catch(err => {
                this.setState({fetching: false})
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
            // If search query is 0 length, match everything
            if (this.state.search.length === 0) return true
            // If match regex, matches the patch
            if (märke.name.toLowerCase().match(new RegExp(this.state.search.toLowerCase(), "g"))) return true
            // If match any creator on the patch, matches the patch
            if (märke.creators
                .map(c => c.name.toLowerCase().match(new RegExp(this.state.search.toLowerCase(), "g"))  !== null)
                .reduce((acc, curr) => acc + curr, 0) > 0
               ) return true
            else return false
        }

        const matchesStockFilter = märke => {
            const { stockFilter, stockFilterOptions } = this.state

            if (stockFilter === stockFilterOptions[0].value) return true
            if (stockFilter === stockFilterOptions[1].value) return märke.inStock === true
            if (stockFilter === stockFilterOptions[2].value) return märke.inStock === false
            else return true
        }

        //Clears both selected tags and search query
        const clearAll = () => {
            this.setState({search: "", filterTagsQuery: "", selectedTags: [], sortRule: this.state.sortOptions[0].value})
        }
        
        //Shows/hides tags and saves the state to localstorage
        const toggleShowTags = () => {
            this.setState({showTags: !this.state.showTags}, () => {
                localStorage.setItem('showTags', JSON.stringify(this.state.showTags));
            })
        }
        
        //Function that sorts results
        const sortResults = () => {
            const {sortRule} = this.state
            
            if (sortRule === this.state.sortOptions[0].value) return this.state.märken

            if (sortRule === this.state.sortOptions[1].value) {
                return [...this.state.märken].sort((a, b) => {
                    const A = a.name.toLowerCase()
                    const B = b.name.toLowerCase()
                    if (A < B) return -1
                    if (A > B) return 1
                    return 0
                })
            }

            if (sortRule === this.state.sortOptions[2].value) {
                return [...this.state.märken].sort((a, b) => {
                    const A = a.name.toLowerCase()
                    const B = b.name.toLowerCase()
                    if (A > B) return -1
                    if (A < B) return 1
                    return 0
                })
            }

            if (sortRule === this.state.sortOptions[3].value) {
                return [...this.state.märken].sort((a, b) => {
                    let A = a.price.value.toLowerCase()
                    let B = b.price.value.toLowerCase()
                    // Puts free first
                    if (b.price.type !== PRICE_TYPES.SET_PRICE) {
                        B = 0
                    }
                    if (A < B) return -1
                    if (A > B) return 1
                    return 0
                })
            }

            if (sortRule === this.state.sortOptions[4].value) {
                return [...this.state.märken].sort((a, b) => {
                    let A = a.price.value.toLowerCase()
                    let B = b.price.value.toLowerCase()
                    // Puts free last
                    if (b.price.type !== PRICE_TYPES.SET_PRICE) {
                        B = 0
                    }
                    if (A > B) return -1
                    if (A < B) return 1
                    return 0
                })
            }

            //Sorts patches after date, today to 1983 and "okänt" 
            if (sortRule === this.state.sortOptions[5].value) {
                // If date is an empty string (It has been marked as "unknown"), calculate it as 0 (otherwise the sorting wouldn't work as new Date("") doesn't work)
                return [...this.state.märken].sort((a, b) => (b.date === "" ? 0 : new Date(b.date)) - (a.date === "" ? 0 : new Date(a.date)))
            }

            //Sorts patches after date, "Okänt" and 1983" to today 
            if (sortRule === this.state.sortOptions[6].value) {
                // If date is an empty string (It has been marked as "unknown"), calculate it as 0 (otherwise the sorting wouldn't work as new Date("") doesn't work)
                return [...this.state.märken].sort((a, b) => (a.date === "" ? 0 : new Date(a.date)) - (b.date === "" ? 0 : new Date(b.date)))
            }

            // Sorts patches after upload date, new to old
            if (sortRule === this.state.sortOptions[7].value) {
                return [...this.state.märken].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            }

            //Sorts patches after upload date, old to new
            if (sortRule === this.state.sortOptions[8].value) {
                return [...this.state.märken].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            }
            

            return this.state.märken
        }

        return (
            <PatchArchiveView
                numPatches={this.state.numPatches}
                tags={this.state.tags}
                selectedTags={this.state.selectedTags}
                searchQuery={this.state.search}
                sortOptions={this.state.sortOptions}
                showTags={this.state.showTags}
                filterTagsQuery={this.state.filterTagsQuery}
                sortRule={this.state.sortRule}
                toggleShowTags={toggleShowTags}
                toggleTag={toggleTag}
                sortResults={sortResults}
                patchTagsMatchesSelected={patchTagsMatchesSelected}
                matchesSearch={matchesSearch}
                handleSearch={e => this.setState({[e.target.id]: e.target.value})}
                clearSearch={e => {this.setState({[e.target.id]: ""})}}
                handleSort={e => this.setState({sortRule: e.target.value})}
                clearAll={clearAll}
                clearSelectedTags={_ => this.setState({selectedTags: []})}
                history={this.props.history}
                stockFilter={this.state.stockFilter}
                stockFilterOptions={this.state.stockFilterOptions}
                matchesStockFilter={matchesStockFilter}
                handleStockFilter={e => this.setState({stockFilter: e.target.value})}
                fetching={this.state.fetching}
            />
        )
    }
}

export default PatchArchive