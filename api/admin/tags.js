var express = require('express')
var router = express.Router()
const dauth = require('../../dauth')
const {Tag} = require('../../models/Tag')

//Middleware for patch access rights, admin and prylis
router.use(dauth.patchesAuth)

// Middleware for checking if id is in request body
const idMiddleware = (req, res, next) => {
    if (_id === undefined || id === "") return res.status(400).json({"error":"No id provided"})
    next()
}

// Middleware that checks if text is present in request body and if it is longer than 1 character
const checkName = (req, res, next) => {
    const {text} = req.body
    if (text === undefined) return res.status(400).json({"error":"Inget namn medskickat."})
    if (text.length < 1) return res.status(400).json({"error":"För kort namn."})
    next()
}

router.post('/update', idMiddleware, checkName, (req, res) => {
    const {text, hoverText, color, backgroundColor, _id} = req.body

    Tag.updateTag(_id, text, hoverText, color, backgroundColor, (err) => {
        if (err) {
            return res.status(500).json({"error":err})
        }
        return res.status(200).json({"status":"Updated tag successfully."})
    })
})
  
router.post('/create', checkName, (req, res) => {
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
            return res.status(500).json({"error": err})
        } else return res.json({"status":"success"})
    })
})

module.exports = router