const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var fileSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true
    },
    __v: false,
})

var FileLink = mongoose.model('FileLink', fileSchema)

module.exports = FileLink