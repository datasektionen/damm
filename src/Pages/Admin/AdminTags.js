import React from 'react'
import {Link} from 'react-router-dom'
import * as ROUTES from '../../routes'
import TagClickable from '../MarkesArkiv/TagClickable'
import Add from '../MarkesArkiv/add.png'
import EditTag from './EditTag'

const INITIAL_STATE = {
    tags: [],
    selectedTag: {
        text: "",
        color: "",
        backgroundColor: "",
        hoverText: ""
    },
    search: "",
    newTag: false,
}

class AdminTags extends React.Component {
    constructor(props) {
        super(props)

        this.state = {...INITIAL_STATE}

        this.fetchTags = this.fetchTags.bind(this)
    }

    componentDidMount() {
        this.fetchTags()
    }
    
    fetchTags() {
        fetch(ROUTES.API_GET_TAGS)
        .then(res => res.json())
        .then(res => {
            console.log(res)
            this.setState({tags: res, selectedTag: this.state.selectedTag})
        })
        .catch(err => {
            console.log(err)
        })
    }

    render() {

        const selectTag = (e, i) => {
            this.setState({selectedTag: this.state.tags[i], selectedIndex: i})
        }

        const newTag = e => {
            this.setState({selectedTag: {}})
        }

        const handleChange = (e) => {
            this.setState({
                [e.target.name]: e.target.value
            })
        }

        return (
            <div className="Admin">
                <div className="Header">
                    <div className="HeaderLeft"><Link to={ROUTES.ADMIN}>« Tillbaka</Link></div>
                    <div><h2>Hantera märkestaggar</h2></div>
                </div>
                <div className="Tags">
                    <div className="bar">
                        <div className="sök">
                            <input name="search" type="text" placeholder="Sök" onChange={e => handleChange(e)} value={this.state.search} />
                            {/* <img className="clearImg" src={Add} onClick={() => {this.setState({search: ""})}}/> */}
                        </div>
                        <button onClick={e => newTag(e)}>Ny tagg</button>
                        <div className="tags">
                            {this.state.tags.map((x,i) => x.text.toLowerCase().match(new RegExp(this.state.search.toLowerCase(), "g")) ? <div className="barTag" key={i}><TagClickable {...x} onClick={e => {selectTag(e, i)}} selectedTags={[this.state.selectedTag]}/></div> : undefined)}
                        </div>
                    </div>
                    <div className="content">
                        {this.state.selectedTag.text !== "" ?
                            <EditTag {...this.state.selectedTag} fetchTags={() => this.fetchTags()} />
                        :
                            <div>Klicka på en tagg</div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default AdminTags