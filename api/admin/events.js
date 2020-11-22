var express = require('express')
var router = express.Router()
const dauth = require('../../dauth')
const moment = require('moment')
const {error, error500} = require('../../util/error')

const Event = require('../../models/Event')

// Middleware that hecks if id is in the request body, if not, return an error.
const idMiddleware = (req, res, next) => {
    const { id } = req.body
    if (id === undefined || id === "") return error(res, 403, "Inget id meskickat.")
    next()
}

const handleMiddleware = (req, res, next) => {
    const { accept, changes } = req.body
    if (!accept) return error(res, 403, "Acceptansstatus ej angivet.")
    
    next()
}

// Middlewares for this route. Admin and id middleware
router.use(dauth.adminAuth)
router.use(idMiddleware)

// Behandla ett evenemang, i.e. acceptera eller avslå
router.post('/handle', handleMiddleware, async (req, res) => {
    const { token } = req.query
    const { id, accept, changes } = req.body

    let event = await Event.findById(id)
    if (!event) return error(res, 404, "Händelsen hittades ej.")
    if (event.accepted.status === true) return error(res, 403, "Händelsen är redan behandlad.")

    let user = await dauth.getUser(token)
    if (!user) return error500(res, "")
    
    let updatedState = {
        accepted: {
            status: true,
            accepted: accept,
            user: user._id,
            date: moment().format(),
        },
    }

    // Only apply changes if we accept the event
    if (changes && accept === true) {
        if (changes.title) updatedState["title"] = changes.title
        if (changes.content) updatedState["content"] = changes.content
        if (changes.date) updatedState["date"] = changes.date
    }
    
    Event.findByIdAndUpdate({_id: id}, {$set: updatedState}, (err, _) => {
        if (err) return error500(res, err)
        if (accept === false) {
            setTimeout(_ => {
                Event.findByIdAndDelete(id, (err, removed) => {
                    if (err) console.log("Failed to remove event after 24h timeout. Already removed?")
                    else console.log(`Removed event after 1h timeout: ${removed.title}`)
                })
            }, 60*60*1000)
        }
        return res.status(200).json({"status":(accept ? "Händelsen godkänd." : "Händelsen avslagen."), "accepted":accept})
    })
})

// Endpoint to delete an event
router.post('/delete', (req, res) => {
    const { id } = req.body

    Event.findByIdAndDelete(id, (err, result) => {
        if (err) return error500(res, err)
        if (!result) return error(res, 404, "Kunde inte hitta händelsen.")
        return res.status(200).json({"status":"Händelsen togs bort."})
    })
})

// Endpoint to update an event
router.post('/update', (req, res) => {
    const { id, changes } = req.body

    let updated = {}
    if (changes) {
        if (changes.title !== undefined) updated.title = changes.title
        if (changes.content !== undefined) updated.content = changes.content
        if (changes.date !== undefined) updated.date = changes.date
    } else return error(res, 403, "Inga ändringar, kan ej uppdatera händelsen.")

    Event.findByIdAndUpdate(id, {$set: updated}, (err, result) => {
        console.log(err)
        console.log(result)
        if (err) return res.status(500).json({"error":err})
        if (result === null) return error(res, 404, "Kunde inte hitta händelsen.")
        else return res.status(200).json({"status":"Händelsen uppdaterad."})
    })
})

module.exports = router