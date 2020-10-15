var express = require('express')
var router = express.Router()
const dauth = require('../../dauth')
const moment = require('moment')

const User = require('../../models/User')
const Event = require('../../models/Event')

router.use(dauth.adminAuth)

router.post('/accept', (req, res) => {
    const {token} = req.query
    const { id, accept, comment, changes } = req.body
    console.log(req.body)

    if (id === undefined || id === "") return res.status(403).json({"error":"No token provided."})
    
    dauth.getUser(token)
    .then(user => {

        let acceptedObject
        if (accept === "godkänn") {
            acceptedObject = {
                accepted: {
                    status: true,
                    accepted: true,
                    user: user._id,
                    date: moment(),
                    comment: ""  
                }
            }
        }
        else if (accept === "avslå") {
            acceptedObject = {
                accepted: {
                    status: true,
                    accepted: false,
                    user: user._id,
                    date: moment(),
                    comment  
                }
            }
        }
        else if (accept === "godkännmedändring") {
            acceptedObject = {
                accepted: {
                    status: true,
                    accepted: true,
                    user: user._id,
                    date: moment(),
                    comment  
                },
                ...changes
            }
        }

        console.log(user)
        Event.findByIdAndUpdate(id, {
            ...acceptedObject
        }, (err, _) => {
            if (err) {
                return res.status(500).json({"error":"Something went wrong"})
            } else {
                return res.status(200).json({"status":"Updated event status successfully!"})
            }
        })
    })

})

module.exports = router