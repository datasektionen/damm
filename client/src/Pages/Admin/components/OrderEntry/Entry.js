import React from 'react'
import './Entry.css'

const Entry = ({id, state, patch, remove, onChange}) => {
    return (
        <div className="Entry">
            <h3>{patch.name}</h3>
            <div className="fields">
                <table>
                    <thead>
                    <tr>
                        <th>Antal</th>
                        <th>Datum</th>
                        <th>Referensnummer</th>
                        <th>Företag</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="number" min={0} id="amount" value={state.amount} placeholder="Antal" autoComplete="off" onChange={e => onChange(e, id)} /></td>
                            <td><input type="date" id="date" value={state.date} autoComplete="off" onChange={e => onChange(e, id)} /></td>
                            <td><input type="text" id="order" value={state.order} placeholder="Referensnummer" autoComplete="off" onChange={e => onChange(e, id)} /></td>
                            <td><input type="text" id="company" value={state.company} placeholder="Företag" autoComplete="off" onChange={e => onChange(e, id)} /></td>
                        </tr>
                    </tbody>
                </table>
                <i className="fas fa-trash" onClick={_ => remove(patch._id)}/>
                {/* <input type="number" id="amount" value={state.amount} placeholder="Antal" autoComplete="off" onChange={e => onChange(e, id)} />
                <input type="date" id="date" value={state.date} autoComplete="off" onChange={e => onChange(e, id)} />
                <input type="text" id="order" value={state.order} placeholder="Referensnummer" autoComplete="off" onChange={e => onChange(e, id)} />
                <input type="text" id="company" value={state.company} placeholder="Företag" autoComplete="off" onChange={e => onChange(e, id)} />
                <i className="fas fa-trash" onClick={_ => remove(patch._id)}/> */}
            </div>
        </div>
    )
}

export default Entry