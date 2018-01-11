const moment = require('moment')
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGO_URL;

const database = new Promise((resolve, reject) => {
	MongoClient.connect(url, function(err, client) {
		if (err) throw err;
		const res = client
			.db('damm')
			.collection("events")
			.find({}, {title: 1, content: 1, date: 1})
			.toArray()
			.then(x => resolve(x.map(event => ({
				title: event.title,
				content: event.content,
				date: moment(event.date),
				template: 'general'
			}))))
	});
})

module.exports = database;