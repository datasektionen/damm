var express = require('express')
var router = express.Router()
const dauth = require('../../dauth')

router.use(dauth.adminAuth)

router.post('/accept', (req, res) => {
    console.log(req.body)
    res.json({"hej":"då"})
})

module.exports = router