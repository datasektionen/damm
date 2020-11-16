const express = require('express')
const app = express()
const cors = require('cors')
const moment = require('moment')
const morgan = require('morgan')
const fs = require('fs')

var mongoose = require('mongoose');
//Configure process.env
require('dotenv').config()

// Adapters
const dfunkt = require('./adapters/dfunkt')
const sm = require('./adapters/sm')
const database = require('./adapters/database')
const {error} = require('./util/error')


const dAuth = require('./dauth')
const api = require('./api/api')
const adminTags = require('./api/admin/tags')
const adminPatches = require('./api/admin/patches')
const adminEvents = require('./api/admin/events')

const bodyParser = require('body-parser')

const dataGenerator = require('./generator')

const init = _ => dataGenerator([
  dfunkt,
  sm,
  database
])
let cachedData = init()()
let lastCached = moment()

app.use(cors());
app.use(bodyParser.json())
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

app.use(morgan('dev'))

app.use('/', express.static('build'))

//Refresh automatically every 24 hours
setInterval(_ => {
  console.log("Performing automatic refresh...")
  cachedData = init()()
  lastCached = moment()
}, 1000*3600*24)

//Endpoint for manual refresh
app.get('/api/admin/refresh', dAuth.adminAuth, (req, res) => { 
  const limit = lastCached.clone()
  limit.add(1, 'minute')
  if (moment().isBefore(limit)) {
    return error(res, 403, "Already refreshed. Wait a minute...")
  } else {
    console.log("Refreshing...")
    res.status(200).json({"response": "Data refreshed"})
    cachedData = init()()
    lastCached = moment()
  }
})

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true,  useUnifiedTopology: true, useFindAndModify: false })
.then(console.log("DB connected"))
.catch(err => {
    console.log("DB connection error: " + err)
})

mongoose.Promise = global.Promise

app.get('/api', (_, res) => {
  res.send(cachedData)
})

app.get('/damm', (_, res) => res.send('<img style="width: 600px;" src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Dust_bunnies.jpg" />'))

// For the search bar in methone. Available in mobile, not desktop.
const fuzzyfile = fs.readFileSync(`${__dirname}/fuzzyfile.json`)
app.get('/fuzzyfile', (req, res) => res.json(JSON.parse(fuzzyfile)))

//API
app.use('/api/admin/tag', adminTags)
app.use('/api/admin/marke', adminPatches)
app.use('/api/admin/event', adminEvents)
app.use('/api', api)

console.log(`${__dirname}/build/index.html`)
app.get('*', (req, res) => res.sendFile(`${__dirname}/build/index.html`))
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Listening on port ${PORT}!`))
