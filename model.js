var fetch = require('node-fetch')
var mongoose = require('mongoose');

const dAuth = require('./dauth')

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true,  useUnifiedTopology: true })
.then(console.log("DB connected"))
.catch(err => {
    console.log("DB connection error: " + err)
})

mongoose.Promise = global.Promise

var userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    kthid: String,
    ugkthid: String,
    hasAdmin: Boolean
})

userSchema.statics.createFromLogin = function(x, callback) {
    this.findOne({ugkthid: x.ugkthid})
    .then(user => {
        if (!user) {
            user = new this({
                first_name: x.first_name,
                last_name: x.last_name,
                email: x.email,
                kthid: x.user,
                ugkthid: x.ugkthid,
                hasAdmin: false
            })
            user.save().then(user => callback(user))
        } else {
            callback(user)
        }
    })
}

var User = mongoose.model('User', userSchema)

module.exports = {
    User,
}