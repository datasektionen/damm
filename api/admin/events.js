var express = require('express')
var router = express.Router()
const dauth = require('../../dauth')
const moment = require('moment')

const Event = require('../../models/Event')

// Middleware that hecks if id is in the request body, if not, return an error.
const idMiddleware = (req, res, next) => {
    const { id } = req.body
    if (id === undefined || id === "") return res.status(403).json({"error":"No id provided."})
    next()
}

// Middlewares for this route. Admin and id middleware
router.use(dauth.adminAuth)
router.use(idMiddleware)

router.post('/accept', (req, res) => {
    const {token} = req.query
    const { id, accept, comment, changes } = req.body

    // Get the event
    Event.findById(id, (err, event) => {
        if (err) return res.status(500).json({"error": err})
        // Event is already accepted
        if (event.accepted.status === true) return res.status(403).json({"error":"Event already accepted."})

        //Get the user who is accepting
        dauth.getUser(token)
        .then(user => {
            
            // Base object, append relevant stuff based on action
            let acceptedObject = {
                accepted: {
                    status: true,
                    user: user._id,
                    date: moment().format(),
                }
            }
    
            if (accept === "godkänn") {
                acceptedObject.accepted["accepted"] = true
                acceptedObject.accepted["comment"] = ""
            }
            else if (accept === "avslå") {
                acceptedObject.accepted["accepted"] = false
                acceptedObject.accepted["comment"] = comment
            }
            else if (accept === "godkännmedändring") {
                acceptedObject.accepted["accepted"] = true
                acceptedObject.accepted["comment"] = ""
                Object.keys(changes).map(key => {
                    acceptedObject[key] = changes[key]
                })
            }

            Event.findByIdAndUpdate(id, {$set: acceptedObject}, (err, _) => {
                if (err) {
                    return res.status(500).json({"error":"Something went wrong"})
                } else {
                    return res.status(200).json({"status":"Updated event status successfully!"})
                }
            })
        })
    })
})

// Endpoint to delete an event
router.post('/delete', (req, res) => {
    const { id } = req.body

    Event.findByIdAndDelete(id, (err, result) => {
        if (err) return res.status(500).json({"error": err})
        if (result === null) return res.status(404).json({"error":"Couldn't find event."})
        return res.status(200).json({"status":"Deleted event successfully."})
    })
})

// Endpoint to update an event
router.post('/update', (req, res) => {
    const { id, title, content, date } = req.body

    let updated = {}
    if (title !== undefined) updated.title = title
    if (content !== undefined) updated.content = content
    if (date !== undefined) updated.date = date

    Event.findByIdAndUpdate(id, {$set: updated}, (err, result) => {
        console.log(err)
        console.log(result)
        if (err) return res.status(500).json({"error":err})
        else return res.status(200).json({"status":"Event updated successfully."})
    })
})

module.exports = router