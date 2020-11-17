const moment = require("moment");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var markeSchema = new Schema({
    name: {
        type: String,
        trim: true,
        minlength: 1,
    },
    description: {
        type: String,
        trim: true,
    },
    //Håller strängar i formatet: "2020-08-29"
    date: String,
    image: String,
    orders: [{
        company: String,
        order: String,
        date: String,
    }],
    price: String,
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }]
}, {timestamps: true})


markeSchema.statics.create = function(x, callback) {
    var märke = new this({
        name: x.name,
        description: x.description,
        date: x.date,
        image: x.image,
        price: x.price,
        tags: x.tags ? x.tags : [],
        createdBy: x.createdBy,
        orders: x.orders,
    })
    märke.save().then(m => callback(m))
}

var Märke = mongoose.model('Marke', markeSchema)
module.exports = Märke