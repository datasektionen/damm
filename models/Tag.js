const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    __v: false,
}, {timestamps: true})

tagSchema.statics.create = function(x, callback) {
    var tag = new this({
        text: x.text,
        color: x.color,
        backgroundColor: x.backgroundColor,
        hoverText: x.hoverText,
    })
    tag.save().then(tag => callback(tag))
}

tagSchema.statics.updateTag = function(_id, text, hoverText, color, backgroundColor, callback) {
    Tag.updateOne({_id}, {$set: {text, hoverText, color, backgroundColor}}, (err, _) => {
        callback(err)
    })
}

var Tag = mongoose.model('Tag', tagSchema)

module.exports = {
    Tag,
    MAX_TAG_TEXT_LENGTH
}