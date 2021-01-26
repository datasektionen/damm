/*
    This file contains admin endpoints for patches. Creating, editing patches, replacing files,
    registering orders etc.
*/
var express = require('express')
var router = express.Router()
const dauth = require('../../dauth')
const Märke = require('../../models/Märke')
const FileLink = require('../../models/FileLink')
const mongoose = require('mongoose')
let Grid = require('gridfs-stream')
const {error, error500} = require('../../util/error')
const { PRICE_TYPES } = require('../../../client/src/config/constants')
const constants = require('../../util/constants')

const upload = require('../../upload')
const { Tag } = require('../../models/Tag')
let conn = mongoose.connection
var gfs
conn.once('open', () => {
    var mongoDriver = mongoose.mongo
    gfs = new Grid(conn.db, mongoDriver)
})

//Middleware for patch access rights, admin and prylis
// ALL routes on this route use this one
router.use(dauth.patchesAuth)

// Middleware that checks if the request contains an image
const hasImage = (req, res, next) => {
    if (!req.files) return error(res, 403, "Ingen fil medskickad.")
    if (!req.files.images || req.files.images.length === 0) return error(res, 403, "Inga bilder medskickade.")
    if (req.files.images.length !== 2) return error(res, 403, "För få bilder medskickade, en högupplöst och en lågupplöst.")
    next()
}

// Middleware that validates a patch name
const nameValidator = (req, res, next) => {
    const name = req.body.name
    if (!name) return error(res, 403, "Ingen namn angett.")
    if (name.trim().length < 1) return error(res, 403, "Namnet är för kort.")
    next()
}

// Middleware for the edit endpoint
const nameValidatorEdit = (req, res, next) => {
    const name = req.body.name
    if (name) nameValidator(req, res, next)
    else next()
}

// Middleware that validates price (price type and values)
const priceValidator = (req, res, next) => {
    if (!req.body.price) return error(res, 403, "Inget pris medskickat.")
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

// Middleware for the edit endpoint
const priceValidatorEdit = (req, res, next) => {
    if (req.body.price) {
        priceValidator(req, res, next)
    } else next()
}

// Helper for order validation
const bulkOrderValidatorHelper = async ({id, order}) => {
    if (!id) {
        return error(res, 403, "Inget id för märkesorder angiven.")
    }
    
    if (!mongoose.isValidObjectId(id)) {
        return error(res, 403, "Ogiltigt id.")
    }

    const patch = await Märke.findById(id).lean()
    if (!patch) return "Märket finns ej."

    if (!order) return `Order för ${patch.name} saknas.`

    // We want to allow amount to be 0, therefore the !== 0 check
    if (!order.amount && order.amount !== 0) return `Inget antal angett för "${patch.name}".`
    if (isNaN(parseInt(order.amount))) return `Angivet antal för "${patch.name}" är inte ett heltal`
    if (parseInt(order.amount) < 0) return `Angivet antal för "${patch.name}" är inte vara negativt.`
    if (!order.date) return `Inget datum angett för "${patch.name}".`
    if (!order.order) return `Inget referensmummer angett för "${patch.name}".`
    if (!order.company) return `Inget företag angett  för "${patch.name}".`

    return null
}

const orderValidator = async (req, res, next) => {
    const orders = req.body.orders
    try {
        if (orders) {

            for (let x of JSON.parse(orders)) {
                // We want to allow amount to be 0, therefore the !== 0 check
                if (!x.amount && x.amount !== 0) return error(res, 403, `Inget antal angett för ordern".`)
                if (isNaN(parseInt(x.amount))) return error(res, 403, `Angivet antal är inte ett heltal`)
                if (parseInt(x.amount) < 0) return error(res, 403, `Angivet antal är inte vara negativt.`)
                if (!x.date) return error(res, 403, `Inget datum angett.`)
                if (!x.order) return error(res, 403, `Inget referensmummer angett.`)
                if (!x.company) return error(res, 403, `Inget företag angett.`)
            }
        }
    } catch (err) {
        console.log(err)
        return error500(res, err)
    }

    next()
}

// Middleware for bulk registering orders
const bulkOrderValidator = async (req, res, next) => {
    const orders = req.body.orders
    try {
        for (let x of orders) {
            let message = await bulkOrderValidatorHelper(x)
            if (message !== null) return error(res, 403, message)
        }

        next()
    } catch(err) {
        return error500(res, err)
    }
}

// Parses form data
const patchFiles = upload.fields([{ name: "images", maxCount: 2 }, { name: "files", maxCount: 10 },])

// Route for creating a patch. Takes data as formdata.
router.post('/create', patchFiles, hasImage, nameValidator, priceValidator, orderValidator, async (req, res) => {
    const body = {}
    Object.keys(req.body).forEach(key => {
        try {
            body[key] = JSON.parse(req.body[key])
        } catch (err) {
            body[key] = req.body[key]
        }
    })

    console.log(req.files)

    const { name, description, date, price, orders, tags, inStock, comment, creators } = body

    try {
        const fileObjects = await createFileLinks(req.files.files)
        
        const patch = await Märke.create({
            name,
            description,
            date,
            price,
            image: constants.createFileURL(req.files.images[0].filename),
            imageLowRes: constants.createFileURL(req.files.images[1].filename),
            orders,
            tags,
            files: fileObjects.map(x => x._id),
            inStock,
            comment,
            creators
        })
        return res.status(200).json({"status":"Märket skapat.", patch})
    } catch(err) {
        if (process.env.NODE_ENV !== "test")
        console.log(err)
        return error500(res, err)
    }
})

// Route to edit a patch
router.post('/edit/id/:id', patchFiles, nameValidatorEdit, priceValidatorEdit, orderValidator, async (req, res) => {
    const { id } = req.params
    if (!mongoose.isValidObjectId(id)) return error(res, 404, "Märket finns ej.")
    if ((await Märke.findById(id)) === null) return error(res, 404, "Märket finns ej.")
    
    const body = {}
    Object.keys(req.body).forEach(key => {
        try {
            body[key] = JSON.parse(req.body[key])
        } catch (err) {
            body[key] = req.body[key]
        }
    })
    
    try {
        const patch = await Märke.findByIdAndUpdate(id, {$set: {...body}})
        if (req.files.images) await replaceImageAndUpdatePatch(patch, req.files.images)
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

// Function that replaces the images of a patch
// Removes the old images from the database (deletes them) and inserts new links to the new images into the patch model
const replaceImageAndUpdatePatch = async (patch, patches) => {
    const highResFilename = patches[0].filename
    const lowResFilename = patches[1].filename

    return new Promise(async (resolve, reject) => {
        try {
            await deleteFileAndChunks(constants.URLToFilename(patch.image))
            await Märke.findByIdAndUpdate(patch._id, {$set: {image: constants.createFileURL(highResFilename)}})
            await deleteFileAndChunks(constants.URLToFilename(patch.imageLowRes))
            await Märke.findByIdAndUpdate(patch._id, {$set: {imageLowRes: constants.createFileURL(lowResFilename)}})
            resolve()
        } catch (err) {
            return reject(err)
        }
    })
}

// Creates FileLinks for files
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
    const patch = await Märke.findById(id)
    if (!patch) return error(res, 404, "Märket finns ej")

    const imageHighRes = constants.URLToFilename(patch.image)
    const imageLowRes = constants.URLToFilename(patch.imageLowRes)

    try {
        await deleteFileAndChunks(imageHighRes)
        await deleteFileAndChunks(imageLowRes)
        const patch = await Märke.findOneAndDelete({ image: constants.createFileURL(imageHighRes) }).populate("files").lean()
        await Märke.findOneAndDelete({ image: constants.createFileURL(imageLowRes) })
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

// Registers multiple orders for multiple different patches.
router.post('/register-orders', bulkOrderValidator, async (req, res) => {
    const { orders } = req.body
    if (!orders || orders.length === 0) return error(res, 403, "Inga beställningar medskickade.")

    try {
        orders.forEach(async x => {
            await Märke.findByIdAndUpdate(x.id, {$push: {orders: x.order}})
        })

    } catch (err) {
        return error500(res, err)
    }

    return res.status(200).json({"status":"Beställningar registrerade."})
})

module.exports = router