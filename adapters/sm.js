const moment = require('moment')
const fetch = require('node-fetch')

const sm = new Promise((resolve, reject) => {
	const events = []

	fetch('https:/' + '/raw.githubusercontent.com/datasektionen/bawang-content/master/organisation/protokoll/body.md')
	    .then(res => res.text())
	    .then(res => {
	    	const lines = res.split("\n")
	    	let year = null
	    	let type = 'SM'
	    	let matches = []
	    	lines.forEach(line => {
	    		matches = line.match(/###\s*(\d{4})/)
	    		if (matches) {
	    			year = matches[1]
	    			return
	    		}

	    		matches = line.match(/##.*DM/)
	    		if (matches) {
	    			type = 'DM'
	    			return
	    		}

	    		matches = line.match(/(\d+)\/(\d+)\s*\[(.*?)\]\((.*?)\)/)
	    		if (matches) {
	    			events.push({
	    				template: 'sm',
	    				name: matches[3] === 'Protokoll' ? type : matches[3],
	    				type: type,
	    				date: moment({ year: parseInt(year), month: parseInt(matches[2]) - 1, day: parseInt(matches[1]) }),
	    				protocol: matches[4]
	    			})
	    			return
	    		}

	    		matches = line.match(/(\d+)\/(\d+)\s*(.*)/)
	    		if (matches) {
	    			events.push({
	    				template: 'sm',
	    				name: matches[3] === 'Protokoll' ? type : matches[3],
	    				type: type,
	    				date: moment({ year: parseInt(year), month: parseInt(matches[2]) - 1, day: parseInt(matches[1]) }),
	    				protocol: null
	    			})
	    			return
	    		}
	    	})
	    })
	    .then(_ => resolve(events))
})

module.exports = sm;