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

//Middleware for patch access rights, admin and prylis
// ALL routes on this route use this one
router.use(dauth.patchesAuth)

// Middleware that checks if the request contains a file, specifically "req.file"
const hasFile = (req, res, next) => {
    if (!req.file) return error(res, 403, "Ingen fil medskickad.")
    next()
}

// Middleware that validates a patch name
const nameValidator = (req, res, next) => {
    const name = JSON.parse(req.body.name)
    if (!name) return error(res, 403, "Ingen namn angett.")
    if (name.trim().length < 1) return error(res, 403, "Namnet är för kort.")
    next()
}

// Middleware that validates price (price type and values)
const priceValidator = (req, res, next) => {
    const price = JSON.parse(req.body.price)
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
    next()
}

//---FILE UPLOAD
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
            filename: "patch-image-" + uuid4()
        }
    },
    root: 'files',
    options: { useUnifiedTopology: true },
})

let upload = multer({
    storage,
    limits: {
        // Max file size of 20 MB
        fileSize: 1024*1024*20
    },
    fileFilter: (req, file, callback) => {
        // TODO: VERY IMPORTANT: Check mimebytes of file to see if it really is an image
        // Right now you can rename an image to .png and fool the system. Is a secrity risk, however
        // only admins can upload
        // Update: doesn't seem to be possible in here, since "file" in here is just an object with metadata, can't read first bytes

        // TODO: Catch error and send back an error message. This works though.
        // When creating a patch: The error is caught in the hasFile middleware
        // When editing, there is no need to send a file (if we don't want to replace image). If you therefore
        // send an invalid file we just skip it. If you send a valid one it is updated.
        if (file.mimetype !== "image/png" && file.mimetype !== "image/jpeg") {
            // Skips uploading the file
            return callback(null, false)
        }
        else callback(null, true)
    }
})
//----------

// Route for creating a patch. Takes data as formdata.
router.post('/create', upload.single('file'), hasFile, nameValidator, priceValidator, async (req, res) => {
    const body = {}
    Object.keys(req.body).forEach(key => {
        body[key] = JSON.parse(req.body[key])
    })

    const { name, description, date, price, orders, tags } = body

    try {
        await Märke.create({
            name,
            description,
            date,
            price,
            // IF YOU CHANGE THIS, MAKE SURE TO CHANGE IN THE REMOVE FUNCTIONS ASWELL
            image: "/api/file/" + req.file.filename,
            orders,
            tags
        })
    } catch(err) {
        console.log(err)
        return error500(res, err)
    }
    return res.status(200).json({"success":"true"})
})

// Route to edit a patch
router.post('/edit/id/:id', upload.single('file'), nameValidator, priceValidator, async (req, res) => {
    const body = {}
    Object.keys(req.body).forEach(key => {
        // If file, it will try to parse 'undefined' which is not valid JSON, throws big error
        if (key === "file") return
        body[key] = JSON.parse(req.body[key])
    })

    const { id } = req.params

    try {
        const patch = await Märke.findByIdAndUpdate(id, {$set: {...body}})
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

// Function that replaces a file of a patch
// Removes the old file from the database (deletes it) and inserts a new link to the file into the patch model
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

// Removes a patch AND its belonging image file by patch id
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

// Remove the patch AND its belonging image by a filename
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
    gfs.files.find().toArray((err, files) => {
        return res.status(200).json(files)
    })
})

// Gets the combined size of all files.
router.get('/files/size', (req, res) => {
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