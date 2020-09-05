const express = require('express')
const app = express()
const cors = require('cors')
const moment = require('moment')

// Adapters
const dfunkt = require('./adapters/dfunkt')
const sm = require('./adapters/sm')
const database = require('./adapters/database')

const dAuth = require('./dauth')
const db = require('./model')
const api = require('./api')

const bodyParser = require('body-parser')

const dataGenerator = require('./generator')
const { model } = require('mongoose')
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

app.use('/', express.static('build'))
// app.get('/refresh', (req, res) => { 
//   const limit = lastCached.clone()
//   limit.add(1, 'minute')
//   if (moment().isBefore(limit)) {
//     res.send('{"response": "error", "message":"Already refreshed"}') 
//   } else {
//     res.send('{"response": "ok"}')
//     cachedData = init()()
//     lastCached = moment()
//   }
// })

//För sökrutan, finns i mobilläge. Eventuellt lägga till dessa globalt (åtminstone en för damm)
const fuzzes = [
  {
    "name":"Tidslinje - Damm",
    "str": "damm tidslinje historia",
    "color": "#e83d84",
    "href": "/"
  },
  {
    "name":"Historiska artefakter - Damm",
    "str": "damm historiska artefakter",
    "color": "#e83d84",
    "href": "/museum"
  },
  {
    "name":"Märkesarkiv - Damm",
    "str": "märkesarkiv arkiv damm märke",
    "color": "#e83d84",
    "href": "/markes-arkiv"
  },
]

app.get('/fuzzyfile', (req, res) => { res.send(`{"@type":"fuzzyfile","fuzzes":${JSON.stringify(fuzzes)}}`) })
app.get('/api', (req, res) => {
  res.send(cachedData)
})
app.use('/api', api)

console.log(`${__dirname}/build/index.html`)
app.get('*', (req, res) => res.sendFile(`${__dirname}/build/index.html`))
app.listen(5000, () => console.log('Listening on port 5000!'))

/*







let mandates = []
let strMonth = (x) => {
  const month = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
  return month[parseInt(x, 10) - 1]
}

let intMonth = (x) => {
  const month = {jan: 1, feb: 2, mar: 3, apr: 4, maj: 5, jun: 6, jul: 7, aug: 8, sep: 9, okt: 10, nov: 11, dec: 12}
  return month[x]
}

let dateCmp = (a, b) => {
  if (intMonth(a[1]) < intMonth(b[1])) return -1
  if (intMonth(a[1]) > intMonth(b[1])) return 1
  if (a[0] < b[0]) return -1
  if (a[0] > b[0]) return 1
  return 0
}

fetch('https://dfunkt.datasektionen.se/api/roles')
  .then(res => res.json())
  .then(roles => {
    let promises = []
    for (let i = 0; i < roles.length; i++) {
      let role = roles[i];
      promises.push(fetch('https://dfunkt.datasektionen.se/api/role/' + role.identifier)
        .then(res => res.json())
        .then(role => {
          role.mandates.forEach(mandate => {
            if (!mandates[mandate.start]) {
              mandates[mandate.start] = []
            }
            mandates[mandate.start].push({
              user: mandate.User,
              role: role
            })  
          })
        }))
    }
    Promise.all(promises).then(x => {
      let sortedKeys = []
      for (let key in mandates) {
          sortedKeys[sortedKeys.length] = key
      }
      sortedKeys.sort().reverse()
      
      let years = []
      sortedKeys.forEach(key => {
        let year = key.substring(0,4)
        let month = key.substring(5,7)
        let day = key.substring(8,10)
        if (years.length === 0 || years[years.length - 1].year !== year) {
          years.push({ year: year, cards: [] })
        }
        years[years.length - 1].cards.push({
          day: day,
          month: strMonth(month),
          title: 'Nya funktionärer',
          content: (
            <div>
              <div className="users">
                { mandates[key].map((x) => (
                  <div key={'crop-elected-' + key + '-' + x.user.kthid + '-' + x.role.role.identifier} className="crop" style={{backgroundImage: 'url(https://zfinger.datasektionen.se/user/' + x.user.kthid + '/image/200)'}} />
                )) }
              </div>
              <p>På denna dag tillträdde</p>
              <ul>
                { mandates[key].map((x) => (
                  <li key={'mandate-' + key + '-' + x.user.kthid + '-' + x.role.role.identifier}>{ x.user.first_name } { x.user.last_name } som { x.role.role.title }</li>
                )) }
              </ul>
            </div>
          ),
          tags: ['dFunkt']
        })
      })

      fetch('https://raw.githubusercontent.com/datasektionen/bawang-content/master/organisation/protokoll/body.md')
        .then(res => res.text())
        .then(res => {
          const lines = res.split("\n")

          let year = null
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i]
            let match = line.match(/###\s*(\d{4})/)
            if (match) {
              year = match[1]
              continue
            }

            match = line.match(/##\s+D-rektoratsmöten/)
            if (match) {
              break
            }

            match = line.match(/(\d+)\/(\d+)\s*\[(.*?)\]\((.*?)\)/)
            if (match) {
              years.forEach(y => {
                if (y.year == year) {
                  let last = y.cards.length > 0 ? [y.cards[0].day, y.cards[0].month] : [32, 'dec']
                  for (let i = 1; i < y.cards.length; i++) {
                    if (dateCmp(last, [parseInt(match[1], 10), strMonth(match[2])]) <= 0) {
                      y.cards.splice(i - 1, 0, {
                        day: parseInt(match[1], 10),
                        month: strMonth(match[2]),
                        title: match[3] + ' hålls',
                        content: (
                          <p>{ match[3] } hålls. Protokollet finns tillgängligt <a href={match[4]} target={'_blank'}>här</a>.</p>
                        ),
                        tags: ['SM', 'Protokoll']
                      })
                      break;
                    }
                    last = [y.cards[i].day, y.cards[i].month]
                  }
                }
              })
              continue
            }

            match = line.match(/(\d+)\/(\d+)\s*(.*)/)
            if (match) {
              years.forEach(y => {
                if (y.year === year) {
                  let last = y.cards.length > 0 ? [y.cards[0].day, y.cards[0].month] : [32, 'dec']
                  for (let i = 1; i < y.cards.length; i++) {
                    if (dateCmp(last, [parseInt(match[1], 10), strMonth(match[2])]) <= 0) {
                      y.cards.splice(i - 1, 0, {
                        day: parseInt(match[1], 10),
                        month: strMonth(match[2]),
                        title: match[3] + ' hålls',
                        content: (
                          <p>{ match[3] } hålls.</p>
                        ),
                        tags: ['SM', 'Protokoll']
                      })
                      break;
                    }
                    last = [y.cards[i].day, y.cards[i].month]
                  }
                }
              })
              continue
            }
          }
        })
        .then(x => {
          this.setState({years})
        })
    })
  })

  */