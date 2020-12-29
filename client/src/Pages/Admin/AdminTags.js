import React from 'react'
import * as ROUTES from '../../routes'
import TagClickable from '../../components/TagClickable'
import EditTag from './EditTag'
import Spinner from '../../components/Spinner/Spinner'
import Input from '../../components/Input/Input'

const INIT_TAG = {
    text: "",
    color: "",
    backgroundColor: "",
    hoverText: ""
}

const INITIAL_STATE = {
    tags: [],
    selectedTag: INIT_TAG,
    search: "",
    newTag: false,
    sortState: 0,
    fetching: true,
}

class AdminTags extends React.Component {
    constructor(props) {
        super(props)

        this.state = {...INITIAL_STATE}

        this.fetchTags = this.fetchTags.bind(this)

        this.editFocus = React.createRef()
    }

    componentDidMount() {
        this.fetchTags()
    }
    
    fetchTags() {
        fetch(ROUTES.API_GET_TAGS)
        .then(res => res.json())
        .then(res => {
            console.log(res)
            this.setState({tags: res, selectedTag: INIT_TAG, fetching: false})
        })
        .catch(err => {
            this.setState({fetching: false})
            console.log(err)
        })
    }

    render() {

        const selectTag = (e, i) => {
            this.setState({selectedTag: this.state.tags[i], newTag: false}, () => {
                if(this.editFocus.current){
                    this.editFocus.current.scrollIntoView({ 
                       behavior: "smooth", 
                       block: "nearest"
                    })
                }
            })
        }

        const newTag = e => {
            this.setState({newTag: true, selectedTag: INIT_TAG}, () => {
                if(this.editFocus.current){
                    this.editFocus.current.scrollIntoView({ 
                       behavior: "smooth", 
                       block: "nearest"
                    })
                }
            })
        }

        const handleChange = (e) => {
            this.setState({
                [e.target.name]: e.target.value
            })
        }

        const sortStates = ["Sortera: A-Ö", "Sortera: Ö-A"]

        const sort = () => {
            if (this.state.sortState === 0) {
                return this.state.tags.sort((a, b) => {
                    const A = a.text.toLowerCase()
                    const B = b.text.toLowerCase()
                    if (A < B) return -1
                    if (A > B) return 1
                    return 0
                })
            }

            if (this.state.sortState === 1) {
                return this.state.tags.sort((a, b) => {
                    const A = a.text.toLowerCase()
                    const B = b.text.toLowerCase()
                    if (A > B) return -1
                    if (A < B) return 1
                    return 0
                })
            }
        }

        return (
            <div className="Admin">
                <div className="Header">
                    <div><h2>Hantera märkestaggar</h2></div>
                </div>
                {this.state.fetching ? 
                    <Spinner style={{height: "70vh"}} />
                    :
                    <div className="Tags">
                        <div className="bar">
                            <div style={{width: "100%", marginBottom: "5px"}}>
                                <Input
                                    style={{width: "95%"}}
                                    name="search"
                                    autoComplete="off"
                                    placeholder="Sök"
                                    onChange={handleChange}
                                    value={this.state.search}
                                    clear={_ => this.setState({search: ""})}
                                />
                            </div>
                            <button id="sort" onClick={() => this.setState({sortState: this.state.sortState === 0 ? 1 : 0})}>{sortStates[this.state.sortState]}</button>
                            <button id="nytagg" onClick={e => newTag(e)}>Skapa ny tagg</button>
                            <div className="tags">
                                {sort(this.state.tags).map((x,i) => x.text.toLowerCase().match(new RegExp(this.state.search.toLowerCase(), "g")) ? <div className="barTag" key={i}><TagClickable {...x} onClick={e => {selectTag(e, i)}} selectedTags={[this.state.selectedTag]}/></div> : undefined)}
                            </div>
                        </div>
                        <div className="content">
                            {this.state.selectedTag.text !== "" || this.state.newTag ?
                                <div ref={this.editFocus}><EditTag {...this.state.selectedTag} fetchTags={() => this.fetchTags()} edit={!this.state.newTag} /></div>
                            :
                                <div className="notag">
                                    Klicka på en existerande tagg eller "Skapa ny tagg"
                                </div>
                            }
                        </div>
                    </div>
                }
            </div>
        )

    }
}

export default AdminTags