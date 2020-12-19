const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var userSchema = new Schema({
    first_name: String,
    last_name: String,
    kthid: String,
    ugkthid: String,
    email: String,
}, { versionKey: false })

userSchema.statics.createFromLogin = function(x, callback) {
    User.findOne({ ugkthid: x.ugkthid })
    .then(user => {
        if (!user) {
            console.log(`Creating new user for ${x.first_name} ${x.last_name}`)
            user = new this({
                first_name: x.first_name,
                last_name: x.last_name,
                kthid: x.user,
                email: x.emails,
                ugkthid: x.ugkthid
            })
            user.save().then(user => callback(user))
        } else {
            console.log(`${x.first_name} ${x.last_name} already in database`)
            callback(user)
        }
    })
}

var User = mongoose.model('User', userSchema)

module.exports = User