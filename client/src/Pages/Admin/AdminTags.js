import React from 'react'
import Alert from '../../components/Alert'
import Spinner from '../../components/Spinner/Spinner'
import SubmitButton from '../../components/SubmitButton/SubmitButton'
import TagClickable from '../../components/TagClickable'
import * as ROUTES from '../../routes'
import './AdminTags.css'

const INIT_TAG = _ => {
    let bg = randomizeBackgroundColor()
    return {
        _id: "",
        text: "",
        color: bg.color,
        backgroundColor: bg.backgroundColor,
        hoverText: "",
        children: [],
    }
}

const INIT_SELECTED = {
    error: "",
    head: undefined,
    selectedTags: [],
    edit: false,
    visible: false,
}

class AdminTags extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            tags: [],
            fetching: true,
            ...INIT_SELECTED
        }

        this.fetchTags = this.fetchTags.bind(this)
        this.clickTag = this.clickTag.bind(this)
    }

    componentDidMount() {
        this.fetchTags()
    }

    fetchTags() {
        fetch(ROUTES.API_GET_TAGS)
        .then(res => res.json())
        .then(json => {
            this.setState({tags: json, fetching: false, visible: false, selectedTags: [], head: undefined})
        })
        .catch(err => {
            this.setState({error: err.toString()})
        })
    }

    clickTag(tag, createNew = false, head = true) {
        if (createNew) {
            let selected = []
            if (!head) selected= [this.state.head]
            this.setState({selectedTags: selected, edit: false, visible: true})
            return
        }

        // If we click a main tag
        if (tag.main === true) {
            // If we click on the tag that is already clicked, deselect it
            if (tag === this.state.head) return this.setState({head: undefined, selectedTags: [], edit: false, visible: false})
            //Else select it
            this.setState({head: tag, selectedTags: [tag], edit: true, visible: true})
        } else {
            // Deselect if click on already selected tag
            if (this.state.selectedTags.filter(x => x.main === false)[0] === tag) return this.setState({selectedTags: [this.state.head], edit: true})
            // Filter out the previous clicked subtag
            this.setState({selectedTags: this.state.selectedTags.filter(x => x.main === true).concat(tag), edit: true, visible: true})
        }
    }

    render() {

        const injectTag = _ => {
            if (this.state.selectedTags.length === 1 && this.state.edit === true) return this.state.head
            if (this.state.selectedTags.length === 1 && this.state.edit === false) return INIT_TAG()
            if (this.state.selectedTags.length === 2 && this.state.edit === true) return this.state.selectedTags[1]
            if (this.state.selectedTags.length === 2 && this.state.edit === false) return INIT_TAG()
            else return INIT_TAG()
        }

        return (
            <div className="Admin">
                <div className="Header">
                    <div><h2>Hantera märkestaggar</h2></div>
                </div>
                {this.state.fetching
                ?
                <Spinner style={{height: "70vh"}} />
                :
                    <div className="AdminTags">
                            <div className="tags">
                                <div className="main">
                                    <div><h1>Huvudtaggar</h1></div>
                                    <div className="content">
                                        {this.state.tags.map(tag =>
                                            <TagClickable {...tag} key={"head-"+tag._id} onClick={_ => this.clickTag(tag)} selectedTags={this.state.selectedTags} />
                                        )}
                                    </div>
                                    <div><button className="green" onClick={_ => this.setState({ head: INIT_TAG(), selectedTags: []}, _ => this.clickTag({}, true))}>Skapa ny</button></div>
                                </div>
                                <div className="sub">
                                    <div><h1>Undertaggar</h1></div>
                                    <div className="content">
                                        {this.state.head && this.state.head.children.map(tag => 
                                            <TagClickable {...tag} key={"sub-"+tag._id} onClick={_ => this.clickTag(tag)} selectedTags={this.state.selectedTags} />
                                        )}
                                        {this.state.selectedTags.length > 0
                                        ?
                                            <div><button className="green" onClick={_ => this.clickTag({}, true, false)}>Skapa ny</button></div>
                                        :
                                            <div>Välj en huvudtagg för att visa undertaggar</div>
                                        }
                                    </div>
                                </div>
                            </div>
                        
                        {this.state.visible &&
                            <TagForm
                                tag={(_ => injectTag())()}
                                edit={this.state.edit}
                                head={this.state.head}
                                fetchTags={this.fetchTags}
                                selectedTags={this.state.selectedTags}
                                close={_ => this.setState({...INIT_SELECTED})}
                            />
                        }
                    </div>
                }
            </div>
        )
    }
}

const randomizeColor = _ => {
    let alphabet = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += alphabet[Math.floor(Math.random() * 16)];
    }
    return color
}

const randomizeBackgroundColor = _ => {
    let bgColor = randomizeColor()
    // http://www.w3.org/TR/AERT#color-contrast
    const brightness = Math.round(((parseInt(bgColor.substring(1,3), 16) * 299) +
                        (parseInt(bgColor.substring(3,5), 16) * 587) +
                        (parseInt(bgColor.substring(5,7), 16) * 114)) / 1000)
    let txtColor = brightness > 125 ? "#000000" : "#ffffff"
    return {color: txtColor, backgroundColor: bgColor}
}

class TagForm extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            original: [],
            text: "",
            color: "",
            backgroundColor: "",
            hoverText: "",
            original: undefined,
            fetching: false,
            error: "",
            success: "",
        }
    }

    updateState() {
        this.setState({
            ...this.props.tag,
            selectedTags: this.props.selectedTags,
            original: this.props.tag,
            error: "",
            success: "",
        })
    }

    componentDidMount() {
        this.updateState()
    }

    componentDidUpdate(prev) {
        if (this.props.tag !== prev.tag) {
            this.updateState()
        }
    }

    render() {
        const { edit, tag, head } = this.props

        const handleChange = e => {
            this.setState({
                [e.target.name]: e.target.value
            })
        }
        
        const save = e => {

            let body
            let fetchURL
            
            this.setState({fetching: true, success: "", error: ""}, () => {
                //Edit or create url and body
                if (this.props.edit) {
                    fetchURL = `${ROUTES.API_UPDATE_TAG}?token=${localStorage.getItem('token')}`
                    body = {...this.state, _id: this.state._id}
                } else { // Create
                    fetchURL = `${ROUTES.API_CREATE_TAG}?token=${localStorage.getItem('token')}`
                    body = {...this.state}
                    if (this.state.selectedTags.length === 1) body["parent"] = this.state.selectedTags[0]._id
                }
                fetch(fetchURL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                })
                .then(res => res.json())
                .then(res => {
                    this.setState({fetching: false})

                    if (res.error) {
                        console.log(res.error)
                        this.setState({"error": res.error})
                    } else {
                        this.props.fetchTags()
                        this.setState({"success":"Tagg sparad!"})
                    }
                })
                .catch(err => {
                    this.setState({fetching: false, error: err.toString()})
                    console.log(err)
                })
            })
        }

        const deleteTag = e => {
            this.setState({fetching: true}, _ => {
                const body = {_id: this.state._id}
                fetch(`${window.location.origin}${ROUTES.API_DELETE_TAG}?token=${localStorage.getItem('token')}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                })
                .then(res => res.json())
                .then(res => {
                    this.setState({fetching: false})

                    if (res.error) {
                        console.log(res.error)
                        this.setState({error:"error"})
                    } else {
                        this.props.fetchTags()
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            })
        }

        const reset = e => {
            this.setState({...this.state.original})
        }

        const text = this.state.text === "" ? "taggnamn" : this.state.text

        return (
            <div className="edit">
                <i title="Stäng" className="fas fa-times" onClick={this.props.close} />
                {this.state.success && <Alert type="success">{this.state.success}</Alert>}
                {this.state.error && <Alert type="error">{this.state.error}</Alert>}
                {edit ? <h1>Redigera "{tag.text}"</h1> : (head.text !== "" ? <h1>Skapa undertagg till "{head.text}"</h1> : <h1>Skapa ny huvudtagg</h1>)}
                <form onSubmit={e => e.preventDefault()}>
                    <div className="name">
                        <span>Namn</span>
                        <input placeholder="Taggnamn" maxLength={18} name="text" autoComplete="off" id="text" type="text" value={this.state.text} onChange={e => handleChange(e)} />
                    </div>
                    <div className="hover">
                        <span>Svävartext</span>
                        <input placeholder="Text som syns när musen är över taggen" name="hoverText" autoComplete="off" id="hoverText" type="text" value={this.state.hoverText} onChange={e => handleChange(e)} />
                    </div>
                    <div className="color">
                        <span>Textfärg</span>
                        <input name="color" type="color" value={this.state.color} onChange={e => handleChange(e)} />
                        <i title="Slumpa färg" className="fas fa-random" onClick={_ => this.setState({color: randomizeColor()})}></i>
                    </div>
                    <div className="bgcolor">
                        <span>Bakgrundsfärg</span>
                        <input name="backgroundColor" type="color" value={this.state.backgroundColor} onChange={e => handleChange(e)} />
                        <i title="Slumpa färg (justerar textfärg om kontrasten för låg)" className="fas fa-random" onClick={_ => this.setState({...randomizeBackgroundColor()})}></i>
                    </div>
                    <div className="preview">
                        <span>Förhandsgranskning</span>
                        <TagClickable
                            text={text}
                            hoverText={this.state.hoverText}
                            color={this.state.color}
                            backgroundColor={this.state.backgroundColor}
                            selectedTags={[{text}]}
                            onClick={() => {}}
                        />
                    </div>
                    <div className="buttons">
                        <button onClick={e => reset(e)}>Ångra ändringar</button>
                        <SubmitButton onClick={save} loading={this.state.fetching} disabled={this.state.fetching} />
                        {this.props.edit ? <i onClick={e => deleteTag(e)} title="Ta bort" disabled={this.state.fetching} className="fas fa-trash"></i> : undefined}
                    </div>
                </form>
            </div>
        )
    }
}

export default AdminTags