var express = require('express')
var router = express.Router()
const dauth = require('../../dauth')
const Märke = require('../../models/Märke')
const FileLink = require('../../models/FileLink')
const mongoose = require('mongoose')
const uuid4 = require('uuid4')
const {error, error500} = require('../../util/error')
const { PRICE_TYPES } = require('../../../client/src/config/constants')
const constants = require('../../util/constants')

let multer = require('multer')
let GridFsStorage = require('multer-gridfs-storage')
let Grid = require('gridfs-stream')

//Middleware for patch access rights, admin and prylis
// ALL routes on this route use this one
router.use(dauth.patchesAuth)

// Middleware that checks if the request contains an image
const hasImage = (req, res, next) => {
    if (!req.files || !req.files.image) return error(res, 403, "Ingen fil medskickad.")
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
        if (file.fieldname === "files") return {
            filename: "patch-file-" + uuid4()
        }
        else return {
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
        
        // Not the patch image, allow all files
        if (file.fieldname === "files") return callback(null, true)
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

const patchFiles = upload.fields([{ name: "image", maxCount: 1 }, { name: "files", maxCount: 10 },])

// Route for creating a patch. Takes data as formdata.
router.post('/create', patchFiles, hasImage, nameValidator, priceValidator, async (req, res) => {
    const body = {}
    Object.keys(req.body).forEach(key => {
        body[key] = JSON.parse(req.body[key])
    })

    const { name, description, date, price, orders, tags, inStock, comment, creators } = body

    try {
        const fileObjects = await createFileLinks(req.files.files)
        
        const patch = await Märke.create({
            name,
            description,
            date,
            price,
            image: constants.createFileURL(req.files.image[0].filename),
            orders,
            tags,
            files: fileObjects.map(x => x._id),
            inStock,
            comment,
            creators
        })
        return res.status(200).json({"success":"true", patch})
    } catch(err) {
        if (process.env.NODE_ENV !== "test")
        console.log(err)
        return error500(res, err)
    }
})

// Route to edit a patch
router.post('/edit/id/:id', patchFiles, nameValidator, priceValidator, async (req, res) => {
    const body = {}
    console.log(req.body)
    Object.keys(req.body).forEach(key => {
        body[key] = JSON.parse(req.body[key])
    })

    console.log(req.files)

    const { id } = req.params
    if (!mongoose.isValidObjectId(id)) return error(res, 404, "Märket finns ej.")
    if ((await Märke.findById(id)) === null) return error(res, 404, "Märket finns ej.")

    try {
        const patch = await Märke.findByIdAndUpdate(id, {$set: {...body}})
        if (req.files.image) await replaceImageAndUpdatePatch(patch, req.files.image[0].filename)
        if (req.files.files) {
            const fileObjects = await createFileLinks(req.files.files)
            await Märke.findByIdAndUpdate(id, {$push: {files: fileObjects.map(x => x._id)}})
        }
    } catch (err) {
        console.log(err)
        return error500(res, err)
    }

    return res.status(200).json({"status":"Märket uppdaterat"})
})

// Replaces the image file of a patch and removes the old one.
router.post('/replace-image/id/:id', upload.single('image'), hasImage, async (req, res) => {
    const { id } = req.params
    if (!id) return error(res, 400, "Inget id medskickat")

    const patch = await Märke.findById(id)
    if (!patch) return error(res, 404, "Märket hittades ej")
    console.log(patch)
    try {
        await replaceImageAndUpdatePatch(patch, req.file.filename)
    } catch (err) {
        console.log(err)
        return error500(res, err)
    }

    return res.status(200).json({status: "Märket uppdaterat, ny bild tillagd."})
})

// Function that replaces a file of a patch
// Removes the old file from the database (deletes it) and inserts a new link to the file into the patch model
const replaceImageAndUpdatePatch = async (patch, filename) => {
    return new Promise(async (resolve, reject) => {
        try {
            await deleteFileAndChunks(constants.URLToFilename(patch.image))
            console.log(constants.URLToFilename(patch.image))
            await Märke.findByIdAndUpdate(patch._id, {$set: {image: constants.createFileURL(filename)}})
            resolve()
        } catch (err) {
            return reject(err)
        }
    })
}

const createFileLinks = async (files = []) => {
    return await Promise.all(
        files === undefined ? []
        :
        files.map(file => {
            return new Promise((resolve, reject) => {
                console.log(file)
                const f = new FileLink({ name: file.originalname, url: constants.createFileURL(file.filename) })
                f.save()
                .then(x => {
                    resolve(x)
                })
                .catch(reject)
            })
        })
    )
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

// Removes a patch, its image and its files by patch id
router.get('/remove/id/:id', async (req, res) => {
    const { id } = req.params
    if (!id) return error(res, 400, "Inget id medskickat")
    const patch = await Märke.findById(id)
    if (!patch) return error(res, 404, "Märket finns ej")

    const filename = constants.URLToFilename(patch.image)

    try {
        await deleteFileAndChunks(filename)
        const patch = await Märke.findOneAndDelete({ image: constants.createFileURL(filename) }).populate("files").lean()
        patch.files.forEach(async (file) => {
            FileLink.deleteOne({_id: file._id})
            deleteFileAndChunks(constants.URLToFilename(file.url))
        })
    } catch (err) {
        console.log(err)
        return error500(res, err)
    }

    return res.status(200).json({"status": "Märket och dess filer borttagna."})
})

// Removes a file from a patch (not image)
router.get('/remove/file/:filename', async (req, res) => {
    const { filename } = req.params

    try {
        const file = await FileLink.find({ url: constants.createFileURL(filename) }).lean()
        if (!file) return error(res, 404, "File not found.")

        await FileLink.deleteOne({url: constants.createFileURL(filename)})
        await deleteFileAndChunks(filename)
        return res.status(200).json({"status":"Removed file from patch"})

    } catch (err) {
        console.log(err)
        return error500(res, err)
    }
})

module.exports = router