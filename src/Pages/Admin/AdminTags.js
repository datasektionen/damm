import React from 'react'
import {Link} from 'react-router-dom'
import * as ROUTES from '../../routes'
import TagClickable from '../MarkesArkiv/TagClickable'
import Add from '../MarkesArkiv/add.png'
import EditTag from './EditTag'

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
            this.setState({tags: res, selectedTag: INIT_TAG})
        })
        .catch(err => {
            console.log(err)
        })
    }

    render() {

        const selectTag = (e, i) => {
            this.setState({selectedTag: this.state.tags[i], newTag: false})
        }

        const newTag = e => {
            this.setState({newTag: true, selectedTag: INIT_TAG})
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
                        <button onClick={e => newTag(e)}>Skapa ny tagg</button>
                        <div className="tags">
                            {this.state.tags.map((x,i) => x.text.toLowerCase().match(new RegExp(this.state.search.toLowerCase(), "g")) ? <div className="barTag" key={i}><TagClickable {...x} onClick={e => {selectTag(e, i)}} selectedTags={[this.state.selectedTag]}/></div> : undefined)}
                        </div>
                    </div>
                    <div className="content">
                        {this.state.selectedTag.text !== "" || this.state.newTag ?
                            <EditTag {...this.state.selectedTag} fetchTags={() => this.fetchTags()} edit={!this.state.newTag} />
                        :
                            <div>Klicka på en existerande tagg eller "Ny tagg"</div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default AdminTags