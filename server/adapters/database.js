const moment = require('moment')
const Event = require('../models/Event')

const database = _ => {
	return new Promise((resolve, reject) => {
		Event.find((err, x) => {
			if (err) reject(err)
			resolve(x.filter(event => event.accepted.accepted === true && event.accepted.status === true).map(event => ({
				title: event.title,
				content: event.content,
				date: moment(event.date),
				template: event.template || 'general'
			})))
		})
	})
}

module.exports = database;