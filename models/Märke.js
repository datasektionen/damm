const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const {MAX_TAG_TEXT_LENGTH} = require('./Tag')

var markeSchema = new Schema({
    name: {
        type: String,
        trim: true,
        minlength: 1,
    },
    description: String,
    numProduced: Number,
    //Håller strängar i formatet: "2020-08-29"
    date: String,
    image: String,
    orders: [{
        company: String,
        order: String
    }],
    price: String,
    tags: [{
        _id: mongoose.Types.ObjectId,
        text: String,
        color: String,
        hoverText: String,
        backgroundColor: String
    }],
    uploadedBy: String,
    uploadDate: String
})


markeSchema.statics.create = function(x, callback) {
    var märke = new this({
        name: x.name,
        description: x.description,
        numProduced: x.numProduced,
        date: x.date,
        image: x.image,
        price: x.price,
        tags: x.tags ? x.tags : [],
        createdBy: x.createdBy,
        orders: x.orders
    })
    märke.save().then(m => callback(m))
}

//Updates the specified tag in a patch. Used when updating the tags db to make the tags in patches match the new changes.
//ugly
markeSchema.statics.updateTags = function(patchID, newTag, callback) {
    
    newTag.text = newTag.text.substring(0,MAX_TAG_TEXT_LENGTH)
    //Find patch by id
    Märke.findById(patchID, (err, res) => {
        let tags = res.tags
        //Search through patch tags. If we found a matching tag, return the updated one. Else return old
        let updatedTags = tags.map(tag => {
            if (mongoose.Types.ObjectId(newTag._id).equals(mongoose.Types.ObjectId(tag._id))) {
                return newTag
            } else return tag
        })
        //Update, set the patch tags to the updated list
        Märke.update({_id: patchID}, {$set: {tags: updatedTags}}, (err, x) => {
            callback(err, x)
        })
    })
}

markeSchema.statics.removeTags = function(patchID, tagtoRemoveID, callback) {
    Märke.findById(patchID, (err, res) => {
        let tags = res.tags
        let updatedTags = tags.map(tag => {

            if (mongoose.Types.ObjectId(tagtoRemoveID).equals(mongoose.Types.ObjectId(tag._id))) {
                return null
            } else return tag
        })
        updatedTags = updatedTags.filter(x => x !== null)

        Märke.update({_id: patchID}, {$set: {tags: updatedTags}}, (err, x) => {
            callback(err, x)
        })
    })
}

var Märke = mongoose.model('Marke', markeSchema)
module.exports = Märke