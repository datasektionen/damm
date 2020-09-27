var express = require('express')
var router = express.Router()
const dauth = require('../../dauth')
const {Tag} = require('../../models/Tag')
const Märke = require('../../models/Märke')

//Middleware for patch access rights, admin and prylis
router.use(dauth.patchesAuth)

const checkName = (req, res, next) => {
    const {text} = req.body
    if (text === undefined) return res.json({"error":"Inget namn medskickat."})
    if (text.length < 1) return res.json({"error":"För kort namn."})
    next()
}

router.post('/update', checkName, (req, res) => {
    const {text, hoverText, color, backgroundColor, _id} = req.body

    Tag.updateTag(_id, text, hoverText, color, backgroundColor, (err) => {
        if (err) {
            return res.json({"error":err})
        } else {
            Märke.find((err, rows) => {
                if (err) {
                    return res.json({"error": err})
                }
                let promises = []
                rows.map(patch => {
                    patch.tags.map(_ => {
                        promises.concat(new Promise((resolve, reject) => {
                            Märke.updateTags(patch._id, {_id, text, hoverText, color, backgroundColor}, (err, x) => {
                                if (err) {
                                    reject(err)
                                } else {
                                    resolve(x)
                                }
                            })
                        }))
                    })
                })
                Promise.all(promises).then((value) => {
                    return res.json({"status":"success"})
                }, (rejected) => {
                    return res.json({"error": err})
                })
            })
        }
    })
})
  
router.post('/create', checkName, (req, res) => {
    const {text, hoverText, color, backgroundColor} = req.body

    console.log(req.body)
    Tag.create({text, hoverText, color, backgroundColor}, (tag) => {
        console.log(tag)
        return res.json({"status":"success"})
    })
})
  
router.post('/delete', (req, res) => {
    const {_id} = req.body

    if (_id === undefined) return res.json({"error":"Inget id medskickat."})

    console.log(req.body)
    Tag.deleteOne({_id}, (err) => {
        if (err) {
            return res.json({"error": err})
        } else return res.json({"status":"success"})
    })
    Märke.find((err, rows) => {
        if (err) {} else {
            rows.map(patch => {
                patch.tags.map(tag => {
                    Märke.removeTags(patch._id, _id, (err, result) => {
                        console.log(result)
                    })
                })
            })
        }
    })
})

module.exports = router