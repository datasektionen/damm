var express = require('express')
var router = express.Router()
const fetch = require('node-fetch')
const Event = require('../models/Event')
const {error, error500} = require('../util/error')
const middlewares = require('../util/middlewares')
const dauth = require('../dauth')

router.post('/create', middlewares.hasToken,(req, res) => {
    const token = req.query.token
    const { title, description, date, template, comment } = req.body

    // Validation
    if (!title || title === "" || title === undefined) return error(res, 403, "Title too short.")
    if (!date || date === "" || date === undefined) return error(res, 403, "No date provided.")
    if (!template || template === "" || template === undefined) return error(res, 403, "No type provided.")

    //Get user info from provided token
    fetch(`${process.env.LOGIN2_URL}/verify/${token}.json?api_key=${process.env.LOGIN2_API_KEY}`)
    .then(x => x.json())
    .then(async (json) => {
        console.log(json)

        //Create event
        try {
            await Event.createFromUgkthid({
                ugkthid: json.ugkthid,
                title,
                content: description,
                date,
                template,
                comment
            })
            return res.json({"message":"success"})
        } catch (err) {
            return error500(res)
        }
    })
    .catch(err => {
        console.log(err)
        return error(res, 403, "Invalid token.")
    })
})

router.get('/all', dauth.adminAuth, (req, res) => {
    Event.find()
    .populate('author.user')
    .populate('accepted.user')
    .lean()
    .exec((err, events) => {
        if (err) {
            console.log(err)
            return error500(res)
        }
        res.status(200).json({events})
    })
})

router.get('/id/:id', dauth.adminAuth, (req, res) => {
    const id = req.params.id

    Event.findById(id)
    .populate('author.user')
    .populate('accepted.user')
    .exec((err, event) => {
        if (err) {
            console.log(err)
            return error500(res, err)
        }
        if (!event) return error(res, 404, "Event not found")
        res.status(200).json(event)
    })
})

module.exports = router