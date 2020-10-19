var express = require('express')
var router = express.Router()
const dauth = require('../../dauth')
const moment = require('moment')
const mongoose = require('mongoose')

const User = require('../../models/User')
const Event = require('../../models/Event')

router.use(dauth.adminAuth)

router.post('/accept', (req, res) => {
    const {token} = req.query
    const { id, accept, comment, changes } = req.body
    console.log(req.body)

    if (id === undefined || id === "") return res.status(403).json({"error":"No id provided."})

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
                    acceptedObject.accepted[key] = changes[key]
                })
            }

            Event.findByIdAndUpdate(id, {$set: {...acceptedObject}}, (err, _) => {
                if (err) {
                    return res.status(500).json({"error":"Something went wrong"})
                } else {
                    return res.status(200).json({"status":"Updated event status successfully!"})
                }
            })
        })
    })
    

})

module.exports = router