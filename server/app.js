const express = require('express')
const app = express()
const cors = require('cors')
const moment = require('moment')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
var mongoose = require('mongoose');

//Configure process.env
require('dotenv').config()

app.use(cors());
app.use(bodyParser.json())
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   // Defend against click-jacking
   res.header("X-Frame-Options", "DENY")
   next();
});

// Prevent attackers from knowing we use Express. They could read the source code, but defend against web bots
app.disable("x-powered-by")

//--------------
// CONNECT TO DB
//--------------
if (process.env.NODE_ENV === "development") app.use(morgan('dev'))
// Use this if not testing, i.e. in production
else if (process.env.NODE_ENV !== "test") app.use(morgan("common"))

let MONGO_URL
// Do not test on real database when testing
if (process.env.NODE_ENV === "test") {
  //VERY important to not change this line to the real db, it will get overwriten...
  MONGO_URL = "mongodb://localhost/damm-testdb"
} else MONGO_URL = process.env.MONGO_URL

mongoose.connect(MONGO_URL, { useNewUrlParser: true,  useUnifiedTopology: true, useFindAndModify: false })
.then(console.log("DB connected"))
.catch(err => {
    console.log("DB connection error: " + err)
    console.log("Shutting down...")
    process.exit(0)
})

mongoose.Promise = global.Promise

// Adapters
const dfunkt = require('./adapters/dfunkt')
const sm = require('./adapters/sm')
const database = require('./adapters/database')
const {error} = require('./util/error')
const constants = require('./util/constants')

const dAuth = require('./dauth')
const api = require('./api/api')
const adminTags = require('./api/admin/tags')
const adminPatches = require('./api/admin/patches')
const adminEvents = require('./api/admin/events')
const files = require('./api/file')
const adminFiles = require('./api/admin/files')

const dataGenerator = require('./generator')

const init = _ => dataGenerator([
  dfunkt,
  sm,
  database
])

let cachedData = init()()
let lastCached = moment()

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
    return error(res, 403, "Tidslinjen laddades nyligen om. Vänta en minut...")
  } else {
    console.log("Refreshing...")
    res.status(200).json({"response": "Tidslinjen uppdaterad (refreshed)"})
    cachedData = init()()
    lastCached = moment()
  }
})

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
app.use(constants.FILE_ROUTE, files)
app.use('/api/admin/files', adminFiles)
app.use('/api', api)
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname + "/../build/index.html")))
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Listening on port ${PORT}!`))

// FOR UNIT TESTS OF ENDPOINTS
module.exports = app