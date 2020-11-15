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

router.get('/id/:id', middlewares.hasToken, (req, res) => {
    const id = req.params.id
    const token = req.query.token
    hasAccessToEvent(token, id)
    .then(result => {
        console.log(result)
        if (result.error) return error500(res, result.error)
        if (result.hasAccess) return res.status(200).json(result)
        else return error(res, 401, "Unauthorized.")
    })
    .catch(result => {
        console.log(result.error)
        return error(res, result.code, "Error", result.error)
    })
})

// Checks if user can access an event page.
const hasAccessToEvent = (token, id) => {
    return new Promise((resolve, reject) => {
        //False by default
        let hasAccess = false
        let ugkthid = undefined

        dauth.getPlsAndUgKthId(token)
        .then(result => {
            //If admin you can access
            if (result.pls.includes("admin")) hasAccess = true
            ugkthid = result.ugkthid
    
            Event.findById(id)
            .populate('author.user')
            .exec((err, result) => {
                if (err) return reject({error: err, code: 404})
                //If user created it he can access
                if (result.author.user.ugkthid === ugkthid) hasAccess = true
                resolve({hasAccess, event: result})
            })
        })
        .catch(err => {
            console.log(err)
            reject({error: err, code: 500})
        })
    })
}

module.exports = router