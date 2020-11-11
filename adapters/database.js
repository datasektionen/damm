const moment = require('moment')
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGO_URL || 'mongodb://localhost';
const Event = require('../models/Event')

const database = _ => {
	return new Promise((resolve, reject) => {
		// MongoClient.connect(url, function(err, client) {
		// 	if (err) throw err;
		// 	const res = client
		// 		.db('damm')
		// 		.collection("events")
		// 		.find({}, {title: 1, content: 1, date: 1})
		// 		.toArray()
		// 		.then(x => resolve(x.map(event => ({
		// 			title: event.title,
		// 			content: event.content,
		// 			date: moment(event.date),
		// 			template: event.template || 'general'
		// 		}))))
		// })
		// Event.find({}, (err, res) => {
		// 	console.log(res)
		// })

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