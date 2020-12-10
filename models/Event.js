const moment = require("moment");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('./User')

var eventSchema = new Schema({
    title: {
        type: String,
        minlength: 1,
        trim: true,
    },
    content: {
        type: String,
        trim: true,
    },
    date: String,
    template: String,
    accepted: {
        // status: false if not yet "behandlad" by someone, else true
        // accepted: Whether it was accepted or not by admin
        status: Boolean,
        accepted: Boolean,
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        date: String,
        comment: String,
    },
    author: {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        date: String,
    },
    comment: String,
})

eventSchema.statics.createFromUgkthid = function(x, callback) {
    return new Promise(async (resolve, reject) => {

        const user = await User.findOne({ugkthid: x.ugkthid})
        if (!user) return reject()

        const event = new this({
            title: x.title,
            content: x.content,
            date: x.date,
            template: x.template,
            accepted: {
                status: false,
                accepted: undefined,
                user: undefined,
                date: undefined,
                comment: ""
            },
            author: {
                user: user._id,
                date: moment()
            },
            comment: x.comment,
        })

        event.save()
        .then(resolve)
        .catch(reject)
    })
}

var Event = mongoose.model('Event', eventSchema)

module.exports = Event