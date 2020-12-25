import React, { useEffect, useState } from 'react'
import Alert from '../../components/Alert'
import * as ROUTES from '../../routes'
import Dropdown from './components/Dropdown'
import Entry from './components/OrderEntry/Entry'

/**
 * Admin page for registering multiple orders at once.
 * 
 */

class AdminOrder extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            patches: [],
            error: "",
            success: "",
            search: "",
            orders: [],
            fetching: false,
        }

        this.submit = this.submit.bind(this)
    }

    // Fetch all patches
    componentDidMount() {
        fetch(ROUTES.API_GET_MÄRKEN)
        .then(res => res.json())
        .then(json => {
            if (json.error) {
                this.setState({error: json.error})
            } else {
                this.setState({patches: json})
            }
        })
        .catch(err => {
            this.setState({error: err})
        })
    }

    submit() {
        this.setState({error: "", success: "", fetching: true})
        
        // Get the order keys
        let keys = Object.keys(this.state).filter(k => k.match(/^patch\-.*$/))
        // get the order data from state
        let orders = []
        keys.forEach(k => {
            orders = orders.concat({order: this.state[k], id: k.split("patch-")[1]})
        })
        
        console.log(orders)
        const body = {orders}

        fetch(`${ROUTES.API_REGISTER_ORDERS}?token=${localStorage.getItem("token")}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        })
        .then(res => res.json())
        .then(json => {
            this.setState({fetching: false})
            if (json.error) {
                this.setState({error: json.error})
            } else {
                this.setState({success: json.status, orders: []})
            }
        })
        .catch(json => {
            this.setState({error: json.toString(), fetching: false})
        })

    }

    render() {

        // Adds a patch to the order state and sets up a state for the patch. It only does so if it doesn't exist already.
        // Clears the search field.
        const addItem = patch => {
            this.setState({search: ""})
            if (this.state.orders.filter(o => o.patch._id === patch._id).length === 1) return
            
            this.setState({
                ["patch-"+patch._id]: {amount: 0, date: "", company: "", order: ""},
                orders: this.state.orders.concat({patch})
            })
        }
        
        // Removes a patch from the orders list and removes the entry state of a patch by id.
        const removeItem = id => {
            this.setState({orders: this.state.orders.filter(o => o.patch._id !== id)}, _ => {
                delete this.state["patch-"+id]
            })
        }

        // Edit the patch with correct id
        // Sets the previous values and edits the specified one
        const onEntryChange = (e, id) => {
            this.setState({
                ["patch-"+id]: {
                    ...this.state["patch-"+id],
                    [e.target.id]: e.target.value
                }
            })
        }

        const reset = _ => {
            this.setState({orders: [], error: "", success: "", search: ""})
        }

        return (
            <div className="Admin">
                <div className="Header">
                    <h2>Registrera beställningar</h2>
                </div>
                <div className="Body">
                    <div className="Box">
                        <div className="center">
                            {this.state.success && <Alert type="success">{this.state.success}</Alert>}
                            {this.state.error && <Alert type="error">{this.state.error}</Alert>}
                            <p style={{margin: "10px 0 20px 0"}}>Här kan du registrera beställningar av flera märken samtidigt. Sök efter märket och fyll i fälten.</p>
                            <Dropdown
                                items={this.state.patches}
                                search={this.state.search}
                                searchPlaceholder={"Sök på namn"}
                                onChange={e => this.setState({search: e.target.value})}
                                itemClick={addItem}
                                clearSearch={_ => this.setState({search: ""})}
                            />
                            {this.state.orders.map((o,i) =>
                                <Entry
                                    key={"entry-"+i}
                                    id={o.patch._id}
                                    state={this.state["patch-"+o.patch._id]}
                                    patch={o.patch}
                                    remove={removeItem}
                                    onChange={onEntryChange}
                                />
                            )}
                            <div style={{margin: "15px"}}>
                                <button disabled={this.state.fetching} className="yellow" onClick={this.submit}>{this.state.fetching ? "Registrerar..." : "Registrera"}</button>
                                <button disabled={this.state.fetching || this.state.orders.length === 0} onClick={reset}>Återställ</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AdminOrder