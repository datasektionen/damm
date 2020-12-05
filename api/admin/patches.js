var express = require('express')
var router = express.Router()
const dauth = require('../../dauth')
const Märke = require('../../models/Märke')
const mongoose = require('mongoose')
const uuid4 = require('uuid4')
const {error, error500} = require('../../util/error')
const { PRICE_TYPES } = require('../../src/config/constants')

let multer = require('multer')
let GridFsStorage = require('multer-gridfs-storage')
let Grid = require('gridfs-stream')

let conn = mongoose.connection
var gfs
conn.once('open', () => {
    var mongoDriver = mongoose.mongo
    gfs = new Grid(conn.db, mongoDriver)
})

let storage = GridFsStorage({
    url: process.env.MONGO_URL,
    file: (req, file) => {
        return {
            // TODO: Prefix "patch" if patch image
            filename: uuid4()
        }
    },
    root: 'files',
    options: { useUnifiedTopology: true },
})

let upload = multer({
    storage
})

//Middleware for patch access rights, admin and prylis
router.use(dauth.patchesAuth)

router.post('/create', upload.single('file'), (req, res) => {
    const {name, description, date, price, orders, tags, radioPrice} = JSON.parse(req.body.body)
    console.log(JSON.parse(req.body.body))
  
    if (!req.file) return error(res, 403, "Ingen fil medskickad.")
    if (!name) return error(res, 403, "Ingen namn angett.")
    if (name.length < 1) return error(res, 403, "Namnet är för kort.")

    // Om vi angett att vi ska specificera priset på märket, validera angett pris
    if (radioPrice === PRICE_TYPES.SET_PRICE) {
        if (price.length === 0 || !price) return error(res, 403, "Inget pris angett.")
        if (!price.match(/^[1-9]+([0-9])*$/)) return error(res, 403, "Angivet pris är inte ett tal.")
    //Om vi inte specificerat pristyp
    } else if (radioPrice === "" || !radioPrice) return error(res, 403, "Inget pris angett.")

    // Om pristyp inte är giltigt
    if (radioPrice !== PRICE_TYPES.SET_PRICE && radioPrice !== PRICE_TYPES.FREE && radioPrice !== PRICE_TYPES.NOT_FOR_SALE && radioPrice !== PRICE_TYPES.UNKNOWN) {
        return error(res, 403, "Ogiltig pristyp.")
    }

    Märke.create({
        name,
        description,
        date,
        price,
        // IF YOU CHANGE THIS, MAKE SURE TO CHANGE IN THE REMOVE FUNCTIONS ASWELL
        image: "/api/file/" + req.file.filename,
        orders,
        tags
    }, (marke) => {
        console.log(marke)
      res.json({"success":"true"})
    })
})

router.get('/replace-image/id/:id', async (req, res) => {
    const { id } = req.params
    if (!id) return error(res, 400, "Inget id medskickat")
    const patch = await Märke.findById(id)
    if (!patch) return error(res, 404, "Märket hittades ej")

    deleteFileAndChunks(patch.image.split("/api/file/")[1], (err, result) => {
        if (err) return error500(res, err)
    })

    // TODO: UPLOAD IMAGE AND UPDATE PATCH OBJECT

    console.log(patch)
    return res.status(200).json(patch)
})

//filename, not including /api/file/
const deleteFileAndChunks = async (filename, callback) => {
    const fileObject = await gfs.files.findOne({ filename })
    gfs.files.findOneAndDelete({ filename }, (err, docs) => {
        if (err) return callback(err, null)
        
        console.log(`Deleted file with filename: ${filename}`)
        
        conn.db.collection("fs.chunks").deleteMany({ files_id: fileObject._id }, (err, result) => {
            if (err) return callback(err, null)
            else {
                console.log(`Deleted ${result.deletedCount} chunk(s) belonging to file with filename: ${filename}`)
                callback(null, result)
            }
        })
    })
}

// Remove the patch and its belonging image
// Filename of image, not including "/api/file/"
// TODO: Create endpoint for removing by patch id
router.get('/remove/filename/:filename', async (req, res) => {
    const { filename } = req.params
    if (!filename) return error(res, 400, "Inget filnamn medskickat")
    const patch = await Märke.findOne({ image: `/api/file/${filename}` })
    if (!patch) return error(res, 404, "Märket finns ej")

    deleteFileAndChunks(filename, (err, _) => {
        if (err) return error500(res, err)
    })

    Märke.findOneAndDelete({ image: `/api/file/${filename}` }, (err, result) => {
        if (err) return error500(res, err)
        else return res.status(200).json({"status": "Märket och dess filer borttagna."})
    })
})

router.get('/chunks', (req, res) => {
    conn.db.collection("fs.chunks").find().toArray((err, c) => {
        return res.status(200).json(c)
    })
})

router.get('/files', (req, res) => {
    gfs.files.find().toArray((err, chunks) => {
        return res.status(200).json(chunks)
    })
})

router.get('/files/size', (req, res) => {
    gfs.files.find().toArray((err, chunks) => {
        let size = chunks.map(c => c.length).reduce((a, b) => a + b, 0)
        return res.status(200).json({size})
    })
})

module.exports = router