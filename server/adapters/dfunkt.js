const moment = require('moment')
const fetch = require('node-fetch')

const fetchMandatesForRole = role => {
	return fetch('https://dfunkt.datasektionen.se/api/role/' + role.identifier)
		.catch(x => console.log('Couldn\'t fetch dfunkt mandates for role ' + role.identifier))
		.then(res => res.json())
		.catch(x => console.log('Couldn\'t parse dfunkt mandates list for role ' + role.identifier))
    .then(r => r.mandates.map(mandate => ({
			date: moment(mandate.start),
			role: role,
			user: mandate.User
    })))
}

const dfunkt = _ => {
	return new Promise((resolve, reject) => {
		let events = []

		// First, we need to fetch all roles, to then be able to fetch their mandates
		// At the moment, dfunkt does not support fetching it all in one request
		fetch('https://dfunkt.datasektionen.se/api/roles')
			.catch(x => console.log('Couldn\'t fetch dfunkt roles list'))
	  	.then(res => res.json())
			.catch(x => console.log('Couldn\'t parse dfunkt roles list'))
	  	.then(roles => {
	    	let promises = []
	    	roles.forEach(role => promises.push(fetchMandatesForRole(role)))

	    	Promise.all(promises)
	    		.then(results => {
	    			const mandates = [].concat.apply([], results)
	    			mandates.sort((a, b) => {
							if (a.date.isBefore(b.date)) {
								return 1
							}
							if (a.date.isAfter(b.date)) {
								return -1
							}
							return 0
						})

	    			const dates = []
	    			mandates.forEach(mandate => {
	  					if (!(mandate.date.format("YYYY-MM-DD") in dates)) {
	  						dates[mandate.date.format("YYYY-MM-DD")] = []
	  					}
	  					dates[mandate.date.format("YYYY-MM-DD")].push(mandate)
	    			})

	    			events = Object.keys(dates).map(key => ({
	    				date: dates[key][0].date,
				    	template: 'dfunkt',
				    	mandates: dates[key],
	  				}))
	    		})
	    		.then(_ => resolve(events))
	    })
	})
}

module.exports = dfunkt;