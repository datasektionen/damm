var express = require('express')
var router = express.Router()
const dauth = require('../../dauth')

router.use(dauth.adminAuth)

router.post('/accept', (req, res) => {
    
})

module.exports = router