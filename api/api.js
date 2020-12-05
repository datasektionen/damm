var express = require('express')
var router = express.Router()
const dAuth = require('../dauth')
const {Tag} = require('../models/Tag')
const Märke = require('../models/Märke')
const eventsNoAdmin = require('./events')
const {error, error500} = require('../util/error')

router.get('/isAdmin', (req, res) => {
    if (req.query.token === undefined) return error(res, 403, "No token provided", "")

    dAuth.getPls(req.query.token)
    .then(x => {
        console.log(x)
        res.json({"pls": x})
    })
    .catch(err => {
        console.log("Invalid token")
        return error(res, 404, "Invalid token", err)
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
        if (err) return error500(res, err)
        else res.send(data)
    })
})
  
router.get('/marken', (req, res) => {
    Märke.find()
    .populate('tags')
    .exec((err, data) => {
        if (err) return error500(res, err)
        return res.status(200).json(data)
    })
})
  
router.get('/marke/id/:id', (req, res) => {
    Märke.findById(req.params.id)
    .populate('tags')
    .exec((err, data) => {
        if (!data) {
            return error(res, 404, "Patch not found", "")
        }
        if (err) {
            return error500(res, err)
        } else {
            console.log(data)
            return res.status(200).send(data)
        }
    })
})

// Gets patches who has tag with specific id
router.get('/marken/tag/id/:id', (req, res) => {
    const id = req.params.id
    console.log(id)
    Märke.find()
    .populate('tags')
    .exec((err, data) => {
        if (!data) {
            return error(res, 404, "Hittade inga märken", err)
        }
        if (err) {
            return error500(res, err)
        } else {
            return res.status(200).json(data.filter(patch => patch.tags.filter(tag => tag._id.toString() === id).length !== 0))
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
            return error(res, 404, "File not found", "")
        }
        console.log("PAST")

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
    return error(res, 404, "Invalid API path.")
})

module.exports = router