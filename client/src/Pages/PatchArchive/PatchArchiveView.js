import React from 'react'

import TagClickable from '../../components/TagClickable'
import Patch from './components/Patch'
import logo from '../../skold.png'
import spinner from '../../res/spinner.svg'
import Input from '../../components/Input/Input'
import TagSelector from '../../components/TagSelector/TagSelector'

const PatchArchiveView = ({numPatches = 0, tags, selectedTags, toggleShowTags, toggleTag, sortResults, patchTagsMatchesSelected, matchesSearch, clearSelectedTags, clearAll, searchQuery, sortRule, sortOptions, showTags, filterTagsQuery, handleChange, clearSearch, clearTagSearch, handleSort, history, stockFilter = false, stockFilterOptions, matchesStockFilter, handleStockFilter, ...rest}) => {
    
    const patches =
        sortResults()
        .filter(x => patchTagsMatchesSelected(x) && matchesSearch(x) && matchesStockFilter(x))
        .map((x,i) => <Patch key={"patch-"+i} {...x} history={history}/>)
    

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
                <h3>Sök bland {numPatches} märken</h3>
                <div className="buttons">
                    <button className="yellow" onClick={clearSelectedTags} disabled={selectedTags.length === 0}>Avmarkera taggar</button>
                    <button className="yellow" onClick={clearAll} disabled={selectedTags.length === 0 && searchQuery.length === 0 && sortRule === sortOptions[0].value}>Rensa filter</button>
                    <button className="yellow" onClick={toggleShowTags}>{showTags ? "Göm taggar" : "Visa taggar"}</button>
                </div>
                <div className="sök">
                    <Input
                        id="search"
                        placeholder="Sök på märken eller skapare"
                        value={searchQuery}
                        onChange={handleChange}
                        autoComplete="off"
                        clear={clearSearch}
                    />
                    <select name="sortera" onChange={handleSort} value={sortRule}>
                        {sortOptions.map((x, i) => <option key={"option-"+i} value={x.value}>{x.text}</option>)}
                    </select>
                    <select name="stockFilter" onChange={handleStockFilter} value={stockFilter}>
                        {stockFilterOptions.map((x) => <option key={"option-stock-"+x.value} value={x.value}>{x.text}</option>)}
                    </select>
                </div>
                {showTags && 
                    <div>
                        <div className="filter">
                            <Input
                                id="filterTagsQuery"
                                placeholder="Filtrera taggar"
                                onChange={handleChange}
                                value={filterTagsQuery}
                                autoComplete="off"
                                clear={clearTagSearch}
                            />
                        </div>
                        <TagSelector fetching={rest.fetchingTags} updateState={rest.updateState} tags={tags} selectedTags={selectedTags} query={filterTagsQuery}  />
                    </div>
                }
            </div>
            <div className="märken">
                {rest.fetchingPatches ? 
                    <img src={spinner} className="spinner"/>
                    :
                    (
                        patches.length === 0 ?
                        <div style={{padding: "50px"}}>
                            Hittade inga märken
                        </div>
                        :
                        patches.map(x => x)
                    )
                }
            </div>
        </div>
    )
}

export default PatchArchiveView