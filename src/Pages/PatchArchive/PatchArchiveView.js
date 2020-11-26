import React from 'react'

import Add from '../../components/add.png'
import TagClickable from '../../components/TagClickable'
import Patch from './components/Patch'
import logo from '../../skold.png'

const PatchArchiveView = ({numPatches = 0, tags, selectedTags, toggleShowTags, toggleTag, sortResults, patchTagsMatchesSelected, matchesSearch, clearSelectedTags, clearAll, searchQuery, sortRule, sortOptions, showTags, filterTagsQuery, handleSearch, clearSearch, handleSort, history}) => {
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
                    <button onClick={clearSelectedTags} disabled={selectedTags.length === 0}>Rensa taggar</button>
                    <button onClick={clearAll} disabled={selectedTags.length === 0 && searchQuery.length === 0 && sortRule === sortOptions[0].value}>Rensa allt</button>
                    <button onClick={toggleShowTags}>{showTags ? "Göm taggar" : "Visa taggar"}</button>
                </div>
                <div className="sök">
                    <input
                        id="search"
                        type="text"
                        placeholder="Sök..."
                        value={searchQuery}
                        onChange={handleSearch}
                        autoComplete="off"
                    />
                    <img
                        id="search"
                        alt="Kryss"
                        className="clearImg"
                        src={Add}
                        onClick={clearSearch}
                    />
                    <select name="sortera" onChange={handleSort} value={sortRule}>
                        {sortOptions.map((x, i) => <option key={"option-"+i} value={x.value}>{x.text}</option>)}
                    </select>
                </div>
                {showTags && 
                    <div>
                        <div className="filter">
                            <input
                                type="text"
                                id="filterTagsQuery"
                                placeholder="Filtrera taggar"
                                onChange={handleSearch}
                                value={filterTagsQuery}
                                autoComplete="off"
                            />
                            <img
                                id="filterTagsQuery"
                                alt="Kryss"
                                className="clearImg"
                                src={Add}
                                onClick={clearSearch}
                            />
                        </div>
                        <div className="tagQueryResult">
                            {tags.map((x,i) => x.text.toLowerCase().match(new RegExp(filterTagsQuery.toLowerCase(), "g")) &&
                                <TagClickable
                                    key={"tag-"+i}
                                    onClick={() => {toggleTag(x)}}
                                    {...x}
                                    selectedTags={selectedTags}
                                />
                            )}
                        </div>
                    </div>
                }
            </div>
            <div className="märken">
                {sortResults().map((x,i) => (patchTagsMatchesSelected(x) && matchesSearch(x)) ? <Patch key={"patch-"+i} {...x} history={history}/> : undefined)}
            </div>
        </div>
    )
}

export default PatchArchiveView