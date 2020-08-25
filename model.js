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
// Märke

var markeSchema = new mongoose.Schema({
    name: String,
    description: String,
    numProduced: Number,
    date: String,
    images: [{
        type: String,
        data: Buffer
    }]
})

markeSchema.statics.create = function(x, callback) {
    var marke = new this({
        name: x.name,
        description: x.description,
        numProduced: x.numProduced,
        date: x.date,
    })
    marke.save().then(marke => callback(marke))
}

var User = mongoose.model('User', userSchema)
var Artefakt = mongoose.model('Artefakt', artefaktSchema)
var Marke = mongoose.model('Marke', markeSchema)

// Artefakt.create({name: "Williams mamma", description: "Williams mamma, beskrivning", image: "en bild", date: moment('2014-03-06')}, (artefakt) => {
//     console.log(artefakt)
// })

module.exports = {
    User,
    Artefakt,
    Marke
}