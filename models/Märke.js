const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { PRICE_TYPES } = require('../src/config/constants')

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
    price: {
        type: {
            type: String
        },
        value: String
    },
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

markeSchema.pre('save', function() {
    const type = this.price.type
    // If type isn't present in PRICE_TYPES
    // https://stackoverflow.com/questions/35948669/how-to-check-if-a-value-exists-in-an-object-using-javascript
    if (Object.values(PRICE_TYPES).indexOf(type) < 0) {
        type = PRICE_TYPES.UNKNOWN
        this.price.value = ""
    }
})

var Märke = mongoose.model('Marke', markeSchema)
module.exports = Märke