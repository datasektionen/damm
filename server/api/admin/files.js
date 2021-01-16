/*
    This file contains admin endpoints for getting some information about the files in
    the database.
*/
var express = require('express')
var router = express.Router()
const dAuth = require('../../dauth')
const mongoose = require('mongoose')
let Grid = require('gridfs-stream')

//----------FILE UPLOAD
let conn = mongoose.connection
var gfs
conn.once('open', () => {
    var mongoDriver = mongoose.mongo
    gfs = new Grid(conn.db, mongoDriver)
})

router.use(dAuth.adminAuth)

router.get('/all', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        return res.status(200).json(files)
    })
})

// Gets the combined size of all files.
router.get('/size', (req, res) => {
    gfs.files.find().toArray((err, chunks) => {
        let size = chunks.map(c => c.length).reduce((a, b) => a + b, 0)
        return res.status(200).json({
            bytes: size,
            kilobytes: size/1024,
            megabytes: size/(1024*1024),
            gigabytes: size/(1024*1024*1024),
        })
    })
})

module.exports = router