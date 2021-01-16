/*
    This file contains a database model for a FileLink.

    A FileLink is created along with a file belonging to a patch. A FileLink holds
    the original file name and the url to the file. FileLinks are referenced in Patch.

    A separate model for this was created since files are considered sensitive (admin only)
    information. By creating a separate model for this, we don't expose anything by mistake since we
    need to populate the FileLink object ids when fetching patches.
*/
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