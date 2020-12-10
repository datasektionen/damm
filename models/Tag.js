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
    return new Promise((resolve, reject) => {
        var tag = new this({
            text: x.text,
            color: x.color,
            backgroundColor: x.backgroundColor,
            hoverText: x.hoverText,
        })

        tag.save()
        .then(resolve)
        .catch(reject)
    })
}

tagSchema.statics.updateTag = function(_id, text, hoverText, color, backgroundColor, callback) {
    return new Promise( async (resolve, reject) => {
        try {
            await Tag.updateOne({_id}, {$set: {text, hoverText, color, backgroundColor}})
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