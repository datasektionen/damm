const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { PRICE_TYPES } = require('../../client/src/config/constants')

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
        company: {
            type: String,
            trim: true,
            required: true
        },
        amount: {
            type: Number,
            trim: true,
            required: true
        },
        order: {
            type: String,
            trim: true,
            required: true
        },
        date: {
            type: String,
            trim: true,
            required: true
        },
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
    }],
    files: [{
        type: Schema.Types.ObjectId,
        ref: 'FileLink'
    }],
    produced: Number,
    inStock: Boolean,
    comment: {
        type: String,
        trim: true
    },
    creators: [{
        name: {
            type: String,
            trim: true,
            required: true
        },
        _id: false,
    }]
}, {timestamps: true})


markeSchema.statics.create = function(x) {
    return new Promise((resolve, reject) => {
        var märke = new this({
            name: x.name ? x.name : "",
            description: x.description ?  x.description : "",
            date: x.date,
            image: x.image,
            price: x.price,
            tags: x.tags ? x.tags : [],
            creators: x.creators ? x.creators : [],
            orders: x.orders ? x.orders : [],
            files: x.files ? x.files : [],
            produced: x.produced ? x.produced : 0,
            inStock: x.inStock ? x.inStock : false,
            comment: x.comment ? x.comment : ""
        })

        märke.save()
        .then(resolve)
        .catch(reject)
    })
}

markeSchema.statics.getAll = function() {
    return new Promise(async (resolve, reject) => {
        try {
            const patches = await
            Märke.find()
            .populate('tags')
            .lean()

            //Remove the files (They are not populated, so it will just be a list of strings, removing them looks nicer)
            patches.forEach(patch => delete patch.files)
            patches.forEach(patch => delete patch.comment)
            patches.forEach(patch => delete patch.orders)
            resolve(patches)
        } catch (err) {
            reject(err)
        }
    })
}

markeSchema.statics.getAllAdmin = function() {
    return new Promise(async (resolve, reject) => {
        try {
            const patches = await
            Märke.find()
            .populate('tags')
            .populate('files')
            .lean()

            resolve(patches)
        } catch (err) {
            reject(err)
        }
    })
}

markeSchema.statics.getById = function(id) {
    return new Promise(async (resolve, reject) => {
        try {
            // return null to create a 404
            if (!mongoose.isValidObjectId(id)) return resolve(null)
            
            const patch = await
            Märke.findById(id)
            .populate('tags')
            .lean()

            if (!patch) return resolve(null)

            //Remove the files (list of strings since not populated)
            delete patch.files
            delete patch.comment
            delete patch.orders

            resolve(patch)
        } catch (err) {
            reject(err)
        }
    })
}

markeSchema.statics.getByIdAdmin = function(id) {
    return new Promise(async (resolve, reject) => {
        try {
            // return null to create a 404
            if (!mongoose.isValidObjectId(id)) return resolve(null)

            const patch = await
            Märke.findById(id)
            .populate('tags')
            .populate('files')
            .lean()
            if (!patch) return resolve(null)

            resolve(patch)
        } catch (err) {
            reject(err)
        }
    })
}

markeSchema.pre('save', function() {
    const type = this.price.type
    // If type isn't present in PRICE_TYPES
    // https://stackoverflow.com/questions/35948669/how-to-check-if-a-value-exists-in-an-object-using-javascript
    if (Object.values(PRICE_TYPES).indexOf(type) < 0) {
        type = PRICE_TYPES.UNKNOWN
        this.price.value = ""
    }
    // Set price value to empty string if type is other than SET_PRICE
    if (this.price.type !== PRICE_TYPES.SET_PRICE) {
        this.price.value = ""
    }
})

var Märke = mongoose.model('Marke', markeSchema)
module.exports = Märke