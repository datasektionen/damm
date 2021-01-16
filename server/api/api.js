/*
    Contains some general api endpoints. also redirects /event/... endpoints to a separate file.

    
*/
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

router.get('/tags', async (req, res) => {
    try {
        const tags = await Tag.find()
        .populate("children")
        .lean()

        return res.status(200).json(tags.filter(x => x.main === true))
    } catch (err) {
        return error500(res, err)
    }

    // Tag.find((err, data) => {
    //     if (err) return error500(res, err)
    //     else res.send(data)
    // })
})
  
router.get('/marken', async (req, res) => {
    let getPatches

    if (req.query.token) {
        const pls = await dAuth.getPls(req.query.token)
        if (pls.includes("admin") || pls.includes("prylis")) {
            getPatches = Märke.getAllAdmin
        } else getPatches = Märke.getAll
    } else {
        getPatches = Märke.getAll
    }
    
    try {
        const patches = await getPatches()
        return res.status(200).json(patches)
    } catch (err) {
        return error500(res, err)
    }
})
  
router.get('/marke/id/:id', async (req, res) => {
    let getPatch

    if (req.query.token) {
        try {
            const pls = await dAuth.getPls(req.query.token)
            if (pls.includes("admin") || pls.includes("prylis")) {
                getPatch = Märke.getByIdAdmin
            } else getPatch = Märke.getById
        } catch(err) {
            return error500(res, err)
        }
    } else {
        getPatch = Märke.getById
    }

    try {
        const patch = await getPatch(req.params.id)
        if (!patch) return error(res, 404, "Patch not found")
        return res.status(200).json(patch)
    } catch (err) {
        return error500(res, err)
    }
})

router.use('/event', eventsNoAdmin)

router.get('/*', (req, res) => {
    return error(res, 404, "Invalid API path.")
})

module.exports = router