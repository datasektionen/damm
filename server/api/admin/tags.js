/*
    This file contain endpoints for tags. Creating, editing and deleting tags.
*/
var express = require('express')
var router = express.Router()
const mongoose = require('mongoose')
const dauth = require('../../dauth')
const {Tag} = require('../../models/Tag')
const Märke = require('../../models/Märke')
const {error, error500} = require('../../util/error')

//Middleware for patch access rights, admin and prylis
router.use(dauth.patchesAuth)

// Middleware for checking if id is in request body
const idMiddleware = (req, res, next) => {
    const { _id } = req.body
    if (_id === undefined || _id === "") return error(res, 403, "Inget id medskickat.")
    if (!mongoose.Types.ObjectId.isValid(_id)) return error(res, 403, "Ogiltig ObjectID, kunde ej parse:a.")
    next()
}

// Middleware that checks if text is present in request body and if it is longer than 1 character
const checkName = (req, res, next) => {
    const { text } = req.body
    if (text === undefined || text.length === 0) return error(res, 403, "Inget namn medskickat.")
    if (text.trim().length < 1) return error(res, 403, "För kort namn.")
    next()
}

// Should allow empty color and backgroundColor field, since the frontend defaults those values.
const validColors = (req, res, next) => {
    const { backgroundColor, color } = req.body
    if (!color.match(/^#[a-fA-f0-9]{6}$/) && color !== "") return error(res, 403, "Ogiltig textfärg.")
    if (!backgroundColor.match(/^#[a-fA-f0-9]{6}$/) && backgroundColor !== "") return error(res, 403, "Ogiltig bakgrundsfärg. Färgen måste vara en RGB på hexadecimal form och 24 bitar.")
    next()
}

const doesExist = async (req, res, next) => {
    const { text, _id } = req.body
    const exists = await Tag.findOne({text})
    if (exists) {
        if (_id) {
            if (exists._id.toString() !== _id.toString()) return error(res, 403, "En tagg med samma namn finns redan.")
        } else {
            return error(res, 403, "En tagg med samma namn finns redan.")
        }
    }
    next()
}

router.post('/update', idMiddleware, checkName, doesExist, validColors, async (req, res) => {
    const {text, hoverText, color, backgroundColor, children, _id} = req.body

    try {
        await Tag.updateTag(_id, text, hoverText, color, backgroundColor, children)
    } catch (err) {
        return error500(res, err)
    }
    return res.status(200).json({"status":"Updated tag successfully."})
})
  
router.post('/create', checkName, doesExist, validColors, async (req, res) => {
    const {text, hoverText, color, backgroundColor, parent} = req.body

    if (parent) {
        if (!mongoose.isValidObjectId(parent)) return error(res, 403, "Ogiltigt id på parent.")
        const parentExists = await Tag.findOne({_id: parent}).lean()
        if (!parentExists) return error(res, 404, "Föräldern finns ej.")
        if (parentExists.main === false) return error(res, 403, "Angiven parent är inte en huvudtagg. Bara huvudtaggar kan ha subtaggar.")
    }
    
    try {
        const created = await Tag.create({text, hoverText, color, backgroundColor, children: [], main: (parent ? false : true)})
        if (parent) {
            const found = await Tag.find({_id: parent})
            if (found) {
                await Tag.updateOne({_id: parent}, {$push: {children: created._id}})
            }
        }
    } catch (err) {
        return error500(res, err)
    }
    return res.status(200).json({"status":"success"})
})
  
router.post('/delete', idMiddleware, async (req, res) => {
    const {_id} = req.body

    try {
        const tag = await Tag.findByIdAndDelete(_id)
        await Tag.deleteMany({_id: tag.children})
        
        await Märke.updateMany({tags: _id}, {$pull: {tags: _id}})
    } catch (err) {
        return error500(res, err)
    }
    return res.json({"status":"success"})
})

module.exports = router