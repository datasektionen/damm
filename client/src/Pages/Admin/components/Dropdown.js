import React, { useEffect, useState } from 'react'
import moment from 'moment'
import './Dropdown.css'
import Add from '../../../components/add.png'
import Placeholder from './300x300.png'

/**
 * Search component that shows results in a dropdown list. Designed for the AdminOrder page.
 * Can be redesigned to a more customizeable dropdown if needed.
 * @param {Array} items items to search among.
 * @param {String} search the search string
 * @param {Function} onChange the function that handles search field change
 * @param {Function} clearSearch function that clears the search field
 * @param {String} searchPlaceholder the placeholder text for the search field
 * @param {Function} itemClick function to call when clicking an item in the dropdown
 */

const Dropdown = ({items, search = "", onChange, clearSearch, searchPlaceholder = "Sök", itemClick}) => {

    const [visible, setVisible] = useState(false)

    useEffect(_ => {
        if (search.length === 0) setVisible(false)
        else setVisible(true)
    }, [search])
    
    //Function which checks if a patch matches the search query
    const matchesSearch = patch => {
        if (search.length === 0) return true
        if (patch.name.toLowerCase().match(new RegExp(search.toLowerCase(), "g"))) return true
        else return false
    }

    const filterPatches = patches => {
        return patches.filter(p => matchesSearch(p))
    }

    return (
        <div className="Dropdown" >
            <div className="sök">
                <input id="search" type="text" value={search} onChange={onChange} autoComplete="off" placeholder={searchPlaceholder} />
                <img
                        id="search"
                        alt="Kryss"
                        className="clearImg"
                        src={Add}
                        onClick={clearSearch}
                        draggable="false"
                />
            </div>
            <div className="results" style={!visible ? {display: "none"} : {}}>
                {filterPatches(items).map(i =>
                    <Item
                        key={"item-"+i._id}
                        image={i.image}
                        title={i.name}
                        date={i.date}
                        price={i.price}
                        inStock={i.inStock}
                        produced={i.produced}
                        onClick={e => {
                            itemClick(i)
                            setVisible(false)
                        }}
                    />   
                ).slice(0, 10)}
            </div>
        </div>
    )
}

import { PRICE_TYPES } from '../../../config/constants'

const Item = ({image, title, date, price, inStock, produced, onClick}) => {

    const priceDisplay = _ => {
        if (price.type === PRICE_TYPES.SET_PRICE) {
            return price.value + " SEK"
        } else return price.type
    }

    return (
        <div className="item" onClick={onClick}>
            <div className="col image">
                <img src={image} onError={e => e.target.src=Placeholder} draggable="false" />
            </div>
            <div className="col content">
                <div>
                    <h3>{title}</h3>
                </div>
                <div className="meta">
                    <span title="Första försäljningsdatum">
                        <i className="far fa-clock"></i> {date ? moment(date).format("DD MMM YYYY") : "Okänt"}
                    </span>
                    <i className="fas fa-circle"></i>
                    <span title="Pris">
                        <i className="fas fa-dollar-sign"></i> {priceDisplay()}
                    </span>
                    <i className="fas fa-circle"></i>
                    <span title="Lagerstatus">
                        <i className="fas fa-box-open"></i> {inStock === true ? "I lager" : "Ej i lager"}
                    </span>
                    <i className="fas fa-circle"></i>
                    <span title="Antal producerade">
                        <i className="fas fa-hashtag"></i> {produced ? produced : 0} st
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Dropdown