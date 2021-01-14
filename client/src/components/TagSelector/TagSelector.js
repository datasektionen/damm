import React from 'react'
import './TagSelector.css'
import TagClickable from '../../components/TagClickable'
import Spinner from '../Spinner/Spinner'

/*
    Tag selector component
    Displays tags and lets you click them.
    Used when creating/editing tags and in patch archive.
*/

const TagSelector = ({tags = [], selectedTags = [], query = "", updateState, fetching = false}) => {

    const selectedTagsIncludesTag = (tagName) => {
        return selectedTags.filter(x => x.text === tagName).length > 0
    }

    const toggleTag = (tag) => {
        //Remove from list
        if (selectedTagsIncludesTag(tag.text)) {
            let nextSelectedTags = [...selectedTags]
            //Filter tag we clicked
            nextSelectedTags = nextSelectedTags.filter(x => x.text !== tag.text)
            // if we clicked a head tag, deselect all children
            for (const t of nextSelectedTags) {
                tag.children.forEach((c,i) => {
                    if (c.name === t.name) nextSelectedTags = nextSelectedTags.filter(x => x !== c)
                })
            }
            updateState({selectedTags: nextSelectedTags})
        } else { //Add
            updateState({selectedTags: selectedTags.concat(tag)})
        }
    }

    return (
        fetching ?
        <Spinner />
        :
        <div className="TagSelector">
            <div className="headtags">
                {tags.map((x,i) => (x.text.toLowerCase().match(new RegExp(query.toLowerCase(), "g")) || selectedTags.filter(y => y._id === x._id).length > 0) &&
                    <TagClickable
                        key={"tag-"+i}
                        onClick={() => {toggleTag(x)}}
                        {...x}
                        selectedTags={selectedTags}
                    />
                )}
            </div>
            <div className="subtags">
                {tags
                .filter(x => {
                    for (const tag of selectedTags) {
                        if (tag._id === x._id) return true
                    }
                    return false
                }).map(x =>
                    x.children
                    .filter(x => x.text.toLowerCase().match(query.toLowerCase()))
                    .map((y,i) =>
                    <TagClickable
                        key={"tag-child-"+i}
                        onClick={_ => toggleTag(y)}
                        {...y}
                        selectedTags={selectedTags}
                    />    
                ))}
            </div>
        </div>
    )
}

export default TagSelector