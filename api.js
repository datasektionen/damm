var express = require('express')
var router = express.Router()
const dAuth = require('./dauth')
const db = require('./model')

const uuid4 = require('uuid4')

let multer = require('multer')
let GridFsStorage = require('multer-gridfs-storage')
let Grid = require('gridfs-stream')

let conn = db.mongoose.connection
var gfs
conn.once('open', () => {
    var mongoDriver = db.mongoose.mongo
    gfs = new Grid(conn.db, mongoDriver)
})

let storage = GridFsStorage({
    url: process.env.MONGO_URL,
    // filename: (req, file, cb) => {
    //     let date = Date.now()
    //     cb(null, `${file.fieldname}-${date}`)
    // },
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

//COMMENT LINE BELOW TO SKIP ADMIN AUTH IN DEV
//TODO: MOVE TOKEN TO PARAM INSTEAD OF JSON
// router.use('/admin', dAuth.adminAuth)
router.post('/admin/upload', upload.single('file'), (req, res) => {
    console.log(req.file)
    if (!req.file) return res.json({"error":"No file provided."})
    
    res.json({
        status: "success",
        id: req.file.id,
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
    })

})

router.get('/file/:filename', (req, res) => {
    // console.log(req.params.filename)
    // gfs.collection('fs.files')
    // console.log(gfs.files.find())
    gfs.files.find({filename: req.params.filename}).toArray((err, files) => {

        // console.log(files)
        if (err) console.log(err)
        if (!files || files.length === 0) {
            return res.status(404).json({"error":"File not found"})
        }

        var rs = gfs.createReadStream({
            filename: files[0].filename,
            // root: 'files'
        })

        res.set('Content-Type', files[0].contentType)
        return rs.pipe(res)
    })
})

router.get('/isAdmin', (req, res) => {
  dAuth.isAdmin(req.query.token)
  .then(x => res.json({"isAdmin": x}))
  .catch(err => {
    console.log("Invalid token")
    res.status(404).json({"error": err})
  })
})

router.get('/artefakter', (req, res) => {
  db.Artefakt.find((err, data) => {
    if (err) {
      console.log(err)
      res.send(err)
    } else res.send(data)
  })
})

router.get('/tags', (req, res) => {
  db.Tag.find((err, data) => {
    if (err) {
      console.log(err)
      res.send(err)
    } else res.send(data)
  })
})

router.get('/marken', (req, res) => {
  db.Marke.find((err, data) => {
    if (err) {
      console.log(err)
      res.send(err)
    } else res.send(data)
  })
})

router.get('/marke/id/:id', (req, res) => {
  db.Marke.find({_id: req.params.id}, (err, data) => {
    if (err) {
      console.log(err)
      res.send(err)
    } else {
      console.log(data)
      res.send(data)
    }
  })
})

router.post('/admin/marke/create', (req, res) => {
  const {name, description, date, price, image, creators, orders, selectedTags} = req.body
  console.log(orders)
  console.log(selectedTags)

  // let tagIDs
  // tagIDs = selectedTags.map(x => db.mongoose.Types.ObjectId(x._id))
  // console.log(tagIDs)

  db.Marke.create({name, description, date, price, image, createdBy: creators, orders, tags: selectedTags}, (marke) => {
    console.log(marke)
    res.json({"success":"true"})
  })
})

router.post('/admin/tag/update', (req, res) => {
  const {text, hoverText, color, backgroundColor, _id} = req.body

  db.Tag.updateTag(_id, text, hoverText, color, backgroundColor, (err) => {
    if (err) {
      return res.json({"error":err})
    } else {
      db.Marke.find((err, rows) => {
        if (err) {
          return res.json({"error": err})
        }
        let promises = []
        rows.map(patch => {
          patch.tags.map(_ => {
            promises.concat(new Promise((resolve, reject) => {
              db.Marke.updateTags(patch._id, {_id, text, hoverText, color, backgroundColor}, (err, x) => {
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

router.post('/admin/tag/create', (req, res) => {
  const {text, hoverText, color, backgroundColor} = req.body
  console.log(req.body)
  db.Tag.create({text, hoverText, color, backgroundColor}, (tag) => {
    console.log(tag)
    return res.json({"status":"success"})
  })
})

router.post('/admin/tag/delete', (req, res) => {
  const {_id} = req.body
  console.log(req.body)
  db.Tag.remove({_id}, (err) => {
    if (err) {
      return res.json({"error": err})
    } else return res.json({"status":"success"})
  })
})


module.exports = router