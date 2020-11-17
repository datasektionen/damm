var express = require('express')
var router = express.Router()
const mongoose = require('mongoose')
const dauth = require('../../dauth')
const {Tag} = require('../../models/Tag')
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
    const { text } = req.body
    const exists = await Tag.findOne({text})
    if (exists) return error(res, 403, "En tagg med samma namn finns redan.")
    next()
}

router.post('/update', idMiddleware, checkName, doesExist, validColors, (req, res) => {
    const {text, hoverText, color, backgroundColor, _id} = req.body

    Tag.updateTag(_id, text, hoverText, color, backgroundColor, (err) => {
        if (err) {
            return error500(res, err)
        }
        return res.status(200).json({"status":"Updated tag successfully."})
    })
})
  
router.post('/create', checkName, doesExist, validColors, async (req, res) => {
    const {text, hoverText, color, backgroundColor} = req.body

    console.log(req.body)
    Tag.create({text, hoverText, color, backgroundColor}, (tag) => {
        return res.json({"status":"success"})
    })
})
  
router.post('/delete', idMiddleware, (req, res) => {
    const {_id} = req.body

    console.log(req.body)
    Tag.deleteOne({_id}, (err) => {
        if (err) {
            return error500(res, err)
        } else return res.json({"status":"success"})
    })
})

module.exports = router