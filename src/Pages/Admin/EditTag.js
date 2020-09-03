import React from 'react'
import * as ROUTES from '../../routes'
import TagClickable from '../MarkesArkiv/TagClickable'

class EditTag extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            text: "",
            color: "",
            backgroundColor: "",
            hoverText: ""
        }
    }

componentWillReceiveProps(props) {
    //If any field is missing from our props, set default values, otherwise we keep
    //the last state, since we won't insert new ones
    const {text = "", color = "", backgroundColor="", hoverText = ""} = props
    this.setState({text, color, backgroundColor, hoverText})
}


render() {
    
    const handleChange = e => {
        this.setState({[e.target.name]: e.target.value})
    }
    
    const save = e => {
        e.preventDefault()
        const body = {...this.state, _id: this.props._id}
        console.log("Saving...")

        fetch(ROUTES.API_UPDATE_TAG, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        .then(res => res.json())
        .then(res => {
            if (res.error) {
                console.log(res.error)
            } else {
                console.log(res)
                this.props.fetchTags()
            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    const noChange = () => {
        return this.state.text === this.props.text && this.state.color === this.props.color && this.state.backgroundColor === this.props.backgroundColor && this.state.hoverText === this.props.hoverText
    }

    const reset = e => {
        e.preventDefault()
        const {text = "", color = "", backgroundColor="", hoverText = ""} = this.props
        this.setState({text, color, backgroundColor, hoverText})
    }
    
    return (
            <div>
                <form>
                    Preview: <TagClickable {...this.state} selectedTags={[{text: this.state.text}]} onClick={() => {}} />
                    Namn: <input name="text" type="text" value={this.state.text} onChange={e => handleChange(e)} />
                    Svävartext: <input name="hoverText" type="text" value={this.state.hoverText} onChange={e => handleChange(e)} />
                    Textfärg: <input name="color" type="color" value={this.state.color} onChange={e => handleChange(e)} />
                    Bakgrundsfärg: <input name="backgroundColor" type="color" value={this.state.backgroundColor} onChange={e => handleChange(e)} />
                    <button onClick={e => reset(e)}>Återställ</button>
                    <button onClick={e => save(e)} disabled={noChange()}>Spara</button>
                </form>
            </div>
        )
    }
}

export default EditTag