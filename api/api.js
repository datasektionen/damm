var express = require('express')
var router = express.Router()
const dAuth = require('../dauth')
const {Tag} = require('../models/Tag')
const Märke = require('../models/Märke')
const eventsNoAdmin = require('./events')

router.get('/isAdmin', (req, res) => {
    if (req.query.token === undefined) return res.status(403).json({"error":"No token provided."})

    dAuth.getPls(req.query.token)
    .then(x => {
        console.log(x)
        res.json({"pls": x})
    })
    .catch(err => {
        console.log("Invalid token")
        res.status(404).json({"error": err})
    })
})

router.get('/artefakter', (req, res) => {
    // db.Artefakt.find((err, data) => {
    //   if (err) {
    //     console.log(err)
    //     res.send(err)
    //   } else res.send(data)
    // })
    res.send([])
})

router.get('/tags', (req, res) => {
    Tag.find((err, data) => {
        if (err) {
        console.log(err)
        res.send(err)
        } else res.send(data)
    })
})
  
router.get('/marken', (req, res) => {
    Märke.find()
    .populate('tags')
    .exec((err, data) => {
        if (err) return res.status(500).json({"error":"Something went wrong", "message":err})
        return res.status(200).json(data)
    })
})
  
router.get('/marke/id/:id', (req, res) => {
    Märke.find({_id: req.params.id})
    .populate('tags')
    .exec((err, data) => {
        if (data === undefined) {
            return res.status(404).json({"error":"Patch not found"})
        }
        if (err) {
            return res.status(500).json({"error":"Something went wrong"})
        } else {
            if (data === null) return res.status(404).json({"error":"Patch not found."})
            console.log(data)
            return res.status(200).send(data)
        }
    })
})


let Grid = require('gridfs-stream')
const mongoose = require('mongoose')

let conn = mongoose.connection
var gfs
conn.once('open', () => {
    var mongoDriver = mongoose.mongo
    gfs = new Grid(conn.db, mongoDriver)
})

router.get('/file/:filename', (req, res) => {
    // console.log(req.params.filename)
    // gfs.collection('fs.files')
    // console.log(gfs.files.find())
    gfs.files.find({filename: req.params.filename}).toArray((err, files) => {

        // console.log(files)
        if (err) console.log(err)
        if (!files || files.length === 0) {
            return res.status(404).json({"error":"File not found"})
        }

        var rs = gfs.createReadStream({
            filename: files[0].filename,
            // root: 'files'
        })

        res.set('Content-Type', files[0].contentType)
        return rs.pipe(res)
    })
})

router.use('/event', eventsNoAdmin)

router.get('/*', (req, res) => {
    res.json({"error":"Invalid API path"})
})

module.exports = router