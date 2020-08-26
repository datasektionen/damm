var fetch = require('node-fetch')
var mongoose = require('mongoose');

const dAuth = require('./dauth')
const moment = require('moment')

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

var tagSchema = new mongoose.Schema({
    text: String,
    color: String,
    backgroundColor: String,
    hoverText: String,
})

tagSchema.statics.create = function(x, callback) {
    var tag = new this({
        text: x.text,
        color: x.color,
        backgroundColor: x.backgroundColor,
        hoverText: x.hoverText,
    })
    tag.save().then(tag => callback(tag))
}

var Tag = mongoose.model('Tag', tagSchema)

var markeSchema = new mongoose.Schema({
    name: String,
    description: String,
    numProduced: Number,
    date: String,
    image: {
        type: String,
        data: Buffer
    },
    orderNo: [String],
    price: String,
    tags: [{text: String}]
})


markeSchema.statics.create = function(x, callback) {
    var märke = new this({
        name: x.name,
        description: x.description,
        numProduced: x.numProduced,
        date: x.date,
        image: "",
        orderNo: [],
        price: x.price,
        tags: [x.tags]
    })
    märke.save().then(artefakt => callback(artefakt))
}

var Marke = mongoose.model('Marke', markeSchema)

var User = mongoose.model('User', userSchema)
var Artefakt = mongoose.model('Artefakt', artefaktSchema)


module.exports = {
    User,
    Artefakt,
    Marke,
    Tag
}