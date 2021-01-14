/*
    This file contains the database model for tags and some useful functions.
*/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// As far I'm aware this is not used anywhere anymore except in this file.
// Remove export?
const MAX_TAG_TEXT_LENGTH = 18

var tagSchema = new Schema({
    text: {
        type: String,
        maxlength: MAX_TAG_TEXT_LENGTH,
        trim: true,
    },
    color: String,
    backgroundColor: String,
    hoverText: {
        type: String,
        trim: true,
    },
    children: [this],
    main: {
        type: Boolean,
        default: true,
    },
    __v: false,
}, {timestamps: true})

tagSchema.statics.create = function(x, callback) {
    return new Promise((resolve, reject) => {
        var tag = new this({
            text: x.text,
            color: x.color,
            backgroundColor: x.backgroundColor,
            hoverText: x.hoverText,
            children: x.children ? x.children : [],
            main: x.main
        })

        tag.save()
        .then(resolve)
        .catch(reject)
    })
}

// Don't ask why I created this function, it was a long time ago...
tagSchema.statics.updateTag = function(_id, text, hoverText, color, backgroundColor, children) {
    return new Promise( async (resolve, reject) => {
        try {
            await Tag.updateOne({_id}, {$set: {text, hoverText, color, backgroundColor}, $push: {children}})
        } catch (err) {
            return reject(err)
        }
        return resolve()
    })
}

var Tag = mongoose.model('Tag', tagSchema)

module.exports = {
    Tag,
    MAX_TAG_TEXT_LENGTH
}