var express = require('express')
var router = express.Router()
const dauth = require('../../dauth')
const Märke = require('../../models/Märke')
const mongoose = require('mongoose')
const uuid4 = require('uuid4')
const {error, error500} = require('../../util/error')

let multer = require('multer')
let GridFsStorage = require('multer-gridfs-storage')
let Grid = require('gridfs-stream')

let conn = mongoose.connection
var gfs
conn.once('open', () => {
    var mongoDriver = mongoose.mongo
    gfs = new Grid(conn.db, mongoDriver)
})

let storage = GridFsStorage({
    url: process.env.MONGO_URL,
    file: (req, file) => {
        return {
            filename: uuid4()
        }
    },
    root: 'files'
})

let upload = multer({
    storage
})

//Middleware for patch access rights, admin and prylis
router.use(dauth.patchesAuth)

router.post('/create', upload.single('file'), (req, res) => {
    const {name, description, date, price, orders, tags, radioPrice} = JSON.parse(req.body.body)
    console.log(JSON.parse(req.body.body))
  
    if (!req.file) return error(res, 403, "Ingen fil medskickad.")
    if (!name) return error(res, 403, "Ingen namn angett.")
    if (name.length < 1) return error(res, 403, "Namnet är för kort.")

    if (radioPrice === "Ange pris") {
        if (price.length === 0 || !price) return error(res, 403, "Inget pris angett.")
    } else if (radioPrice === "" || !radioPrice) return error(res, 403, "Inget pris angett.")
  
    Märke.create({
        name,
        description,
        date,
        price,
        image: "/api/file/" + req.file.filename,
        orders,
        tags
    }, (marke) => {
        console.log(marke)
      res.json({"success":"true"})
    })
})

module.exports = router