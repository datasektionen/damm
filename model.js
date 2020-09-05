var fetch = require('node-fetch')
var mongoose = require('mongoose');

const dAuth = require('./dauth')
const moment = require('moment');

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true,  useUnifiedTopology: true })
.then(console.log("DB connected"))
.catch(err => {
    console.log("DB connection error: " + err)
})

mongoose.Promise = global.Promise


//----------
// User
var userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    kthid: String,
    ugkthid: String
})

userSchema.statics.createFromLogin = function(x, callback) {
    this.findOne({ugkthid: x.ugkthid})
    .then(user => {
        if (!user) {
            user = new this({
                first_name: x.first_name,
                last_name: x.last_name,
                email: x.emails,
                kthid: x.user,
                ugkthid: x.ugkthid
            })
            user.save().then(user => callback(user))
        } else {
            callback(user)
        }
    })
}

//----------
// Historisk artefakt

var artefaktSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    date: String
})

artefaktSchema.statics.create = function(x, callback) {
    var artefakt = new this({
        name: x.name,
        description: x.description,
        image: x.image,
        date: x.date
    })
    artefakt.save().then(artefakt => callback(artefakt))
}

//----------
// Märken och grejer

const MAX_TAG_TEXT_LENGTH = 18

var tagSchema = new mongoose.Schema({
    text: String,
    color: String,
    backgroundColor: String,
    hoverText: String,
})

tagSchema.statics.create = function(x, callback) {
    var tag = new this({
        text: x.text.substring(0,MAX_TAG_TEXT_LENGTH),
        color: x.color,
        backgroundColor: x.backgroundColor,
        hoverText: x.hoverText,
    })
    tag.save().then(tag => callback(tag))
}

tagSchema.statics.updateTag = function(_id, text, hoverText, color, backgroundColor, callback) {
    Tag.updateOne({_id}, {$set: {text: text.substring(0,MAX_TAG_TEXT_LENGTH), hoverText, color, backgroundColor}}, (err, _) => {
        callback(err)
    })
}

var Tag = mongoose.model('Tag', tagSchema)

var markeSchema = new mongoose.Schema({
    name: String,
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
    createdBy: [{
        firstName: String,
        lastName: String,
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
    märke.save().then(artefakt => callback(artefakt))
}

//Updates the specified tag in a patch. Used when updating the tags db to make the tags in patches match the new changes.
//ugly
markeSchema.statics.updateTags = function(patchID, newTag, callback) {
    
    newTag.text = newTag.text.substring(0,MAX_TAG_TEXT_LENGTH)
    //Find patch by id
    Marke.findById(patchID, (err, res) => {
        let tags = res.tags
        //Search through patch tags. If we found a matching tag, return the updated one. Else return old
        let updatedTags = tags.map(tag => {
            if (mongoose.Types.ObjectId(newTag._id).equals(mongoose.Types.ObjectId(tag._id))) {
                return newTag
            } else return tag
        })
        //Update, set the patch tags to the updated list
        Marke.update({_id: patchID}, {$set: {tags: updatedTags}}, (err, x) => {
            callback(err, x)
        })
    })
}

markeSchema.statics.removeTags = function(patchID, tagtoRemoveID, callback) {
    Marke.findById(patchID, (err, res) => {
        let tags = res.tags
        console.log("BEFORE_------------------------")
        console.log(tags)
        let updatedTags = tags.map(tag => {
            console.log(tagtoRemoveID)
            console.log(tag.id)
            console.log(mongoose.Types.ObjectId(tagtoRemoveID).equals(mongoose.Types.ObjectId(tag._id)))
            if (mongoose.Types.ObjectId(tagtoRemoveID).equals(mongoose.Types.ObjectId(tag._id))) {
                return null
            } else return tag
        })
        updatedTags = updatedTags.filter(x => x !== null)
        console.log("AFTER------------------------")
        console.log(updatedTags)
        Marke.update({_id: patchID}, {$set: {tags: updatedTags}}, (err, x) => {
            callback(err, x)
        })
    })
}

var Marke = mongoose.model('Marke', markeSchema)

var User = mongoose.model('User', userSchema)
var Artefakt = mongoose.model('Artefakt', artefaktSchema)


module.exports = {
    User,
    Artefakt,
    Marke,
    Tag,
    mongoose
}