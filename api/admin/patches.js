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

const hasFile = (req, res, next) => {
    if (!req.file) return error(res, 403, "Ingen fil medskickad.")
    next()
}

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
// TODO: Why won't middlewares work for name and price???

router.post('/create', upload.single('file'), hasFile, (req, res) => {
    const { name, description, date, price, orders, tags } = JSON.parse(req.body.body)
    console.log(JSON.parse(req.body.body))
  
    if (!name) return error(res, 403, "Ingen namn angett.")
    if (name.length < 1) return error(res, 403, "Namnet är för kort.")

    // Om vi angett att vi ska specificera priset på märket, validera angett pris
    if (price.type === PRICE_TYPES.SET_PRICE) {
        if (price.value.length === 0 || !price) return error(res, 403, "Inget pris angett.")
        if (!price.value.match(/^[1-9]+([0-9])*$/)) return error(res, 403, "Angivet pris är inte ett tal.")
    //Om vi inte specificerat pristyp
    } else if (price.type === "" || !price.type) return error(res, 403, "Ingen pristyp angiven.")

    // Om pristyp inte är giltigt
    if (Object.values(PRICE_TYPES).indexOf(price.type) < 0) {
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

router.post('/edit/id/:id', upload.single('file'), async (req, res) => {
    const { name, description, date, price, orders, tags } = JSON.parse(req.body.body)
    const { id } = req.params

    if (!name) return error(res, 403, "Ingen namn angett.")
    if (name.length < 1) return error(res, 403, "Namnet är för kort.")

    // Om vi angett att vi ska specificera priset på märket, validera angett pris
    if (price.type === PRICE_TYPES.SET_PRICE) {
        if (price.value.length === 0 || !price) return error(res, 403, "Inget pris angett.")
        if (!price.value.match(/^[1-9]+([0-9])*$/)) return error(res, 403, "Angivet pris är inte ett tal.")
    //Om vi inte specificerat pristyp
    } else if (price.type === "" || !price.type) return error(res, 403, "Ingen pristyp angiven.")

    // Om pristyp inte är giltigt
    if (Object.values(PRICE_TYPES).indexOf(price.type) < 0) {
        return error(res, 403, "Ogiltig pristyp.")
    }

    try {
        const patch = await Märke.findByIdAndUpdate(id, {$set: {...JSON.parse(req.body.body)}})
        if (req.file) await replaceFileAndUpdatePatch(patch, req.file.filename)
    } catch (err) {
        console.log(err)
        return error500(res, err)
    }

    return res.status(200).json({"status":"Märket uppdaterat"})
})

// Replaces the image file of a patch and removes the old one.
router.post('/replace-image/id/:id', upload.single('file'), hasFile, async (req, res) => {
    const { id } = req.params
    if (!id) return error(res, 400, "Inget id medskickat")

    const patch = await Märke.findById(id)
    if (!patch) return error(res, 404, "Märket hittades ej")
    console.log(patch)
    try {
        await replaceFileAndUpdatePatch(patch, req.file.filename)
    } catch (err) {
        console.log(err)
        return error500(res, err)
    }

    return res.status(200).json({status: "Märket uppdaterat, ny bild tillagd."})
})

const replaceFileAndUpdatePatch = async (patch, filename) => {
    return new Promise(async (resolve, reject) => {
        try {
            await deleteFileAndChunks(patch.image.split("/api/file/")[1])
            await Märke.findByIdAndUpdate(patch._id, {$set: {image: `/api/file/${filename}`}})
            resolve()
        } catch (err) {
            return reject(err)
        }
    })
}

// Function that removes a file from the file database.
// Removes both the fs.file entry and all fs.chunks entries belonging to the file.
// filename should not include /api/file/
const deleteFileAndChunks = async (filename) => {
    return new Promise(async (resolve, reject) => {
        try {
            const fileObject = await gfs.files.findOne({ filename })
            await gfs.files.findOneAndDelete({ filename })
            console.log(`Deleted file with filename: ${filename}`)
            const result = await conn.db.collection("fs.chunks").deleteMany({ files_id: fileObject._id })
            console.log(`Deleted ${result.deletedCount} chunk(s) belonging to file with filename: ${filename}`)
            return resolve(result)
        } catch (err) {
            return reject(err)
        }
    })
}

// Removes a patch and its belonging image file by patch id
router.get('/remove/id/:id', async (req, res) => {
    const { id } = req.params
    if (!id) return error(res, 400, "Inget id medskickat")
    const patch = await Märke.findById(id)
    if (!patch) return error(res, 404, "Märket finns ej")

    const filename = patch.image.split("/api/file/")[1]

    try {
        await deleteFileAndChunks(filename)
        await Märke.findOneAndDelete({ image: `/api/file/${filename}` })
    } catch (err) {
        console.log(err)
        return error500(res, err)
    }

    return res.status(200).json({"status": "Märket och dess filer borttagna."})
})

// Remove the patch and its belonging image by a filename
// Filename of image, not including "/api/file/"
router.get('/remove/filename/:filename', async (req, res) => {
    const { filename } = req.params
    if (!filename) return error(res, 400, "Inget filnamn medskickat")
    const patch = await Märke.findOne({ image: `/api/file/${filename}` })
    if (!patch) return error(res, 404, "Märket finns ej")

    try {
        await deleteFileAndChunks(filename)
        await Märke.findOneAndDelete({ image: `/api/file/${filename}` })
    } catch (err) {
        console.log(err)
        return error500(res, err)
    }

    return res.status(200).json({"status": "Märket och dess filer borttagna."})
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