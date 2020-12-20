var express = require('express')
var router = express.Router()
const {error, error500} = require('../util/error')

const mongoose = require('mongoose')
let Grid = require('gridfs-stream')

//----------FILE UPLOAD
let conn = mongoose.connection
var gfs
conn.once('open', () => {
    var mongoDriver = mongoose.mongo
    gfs = new Grid(conn.db, mongoDriver)
})

router.get('/:filename', (req, res) => {
    gfs.files.find({filename: req.params.filename}).toArray((err, files) => {

        // console.log(files)
        if (err) console.log(err)
        if (!files || files.length === 0) {
            return error(res, 404, "File not found", "")
        }

        var rs = gfs.createReadStream({
            filename: files[0].filename,
            // root: 'files'
        })

        res.set('Content-Type', files[0].contentType)
        return rs.pipe(res)
    })
})

module.exports = router