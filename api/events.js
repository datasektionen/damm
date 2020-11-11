var express = require('express')
var router = express.Router()
const fetch = require('node-fetch')
const Event = require('../models/Event')
const {error, error500} = require('../util/error')

router.post('/create', (req, res) => {
    const token = req.query.token
    const { title, description, date, template, comment } = req.body

    // Validation
    if (!title || title === "" || title === undefined) return error(res, 403, "Title too short.")
    if (!date || date === "" || date === undefined) return error(res, 403, "No date provided.")
    if (!template || template === "" || template === undefined) return error(res, 403, "No type provided.")

    if (!token || req.query.token === "") {
        return error(res, 403, "No token provided")
    }

    //Get user info from provided token
    fetch(`${process.env.LOGIN2_URL}/verify/${token}.json?api_key=${process.env.LOGIN2_API_KEY}`)
    .then(x => x.json())
    .then(json => {
        console.log(json)

        //Create event
        Event.createFromUgkthid({
            ugkthid: json.ugkthid,
            title,
            content: description,
            date,
            template,
            comment
        }, (event) => {
            if (!event.error) {
                return res.json({"message":"success"})
            } else {
                return error500(res)
            }
        })
    })
    .catch(err => {
        console.log(err)
        return error(res, 403, "Invalid token.")
    })

})

router.get('/pending', (req, res) => {
    Event.find()
    .populate('author.user')
    .populate('accepted.user')
    .exec((err, events) => {
        if (err) {
            console.log(err)
            return error500(res)
        }
        res.json({events})
    })
})

module.exports = router