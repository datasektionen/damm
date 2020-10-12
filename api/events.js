var express = require('express')
var router = express.Router()
const fetch = require('node-fetch')
const Event = require('../models/Event')

router.post('/create', (req, res) => {
    const token = req.query.token
    const { title, description, date, template } = req.body

    // Validation
    if (!title || title === "" || title === undefined) return res.json({"error":"Title too short."})
    if (!date || date === "" || date === undefined) return res.json({"error":"No date provided."})
    if (!template || template === "" || template === undefined) return res.json({"error":"No type provided."})

    if (!token || req.query.token === "") {
        return res.json({"error":"No token provided"})
    }

    //Get user info from provided token
    fetch(`https://login2.datasektionen.se/verify/${token}.json?api_key=${process.env.LOGIN2_API_KEY}`)
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
        }, (event) => {
            if (!event.error) {
                return res.json({"message":"success"})
            } else {
                console.log(err)
                res.json({"error":err})
            }
        })
    })
    .catch(err => {
        console.log(err)
        return res.json({"error":"Invalid token"})
    })

})

router.get('/pending', (req, res) => {
    Event.find()
    .populate('author.user')
    .populate('accepted.user')
    .exec((err, events) => {
        res.json({events})
    })
})

module.exports = router