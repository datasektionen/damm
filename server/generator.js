/*
	This file generates data to the timeline. It does so for every adapter inserted into it.

	Examples of adapters are dfunk, database and sm/dm which gather data from different sources.
	This function then compile them to the timeline.

	Written by Jonas Dahl.
*/

const moment = require('moment')

const generator = (adapters) => {
	const events = []
	console.log('Generator init', adapters)
	adapters.forEach(adapter => adapter().then(adapterEvents => {
		adapterEvents.sort((a, b) => {
			if (a.date.isBefore(b.date)) {
				return 1
			}
			if (a.date.isAfter(b.date)) {
				return -1
			}
			return 0
		})

		if (events.length === 0) {
			events.push(...adapterEvents)
			return
		}

		if (adapterEvents.length === 0) {
			return
		}

		let i = events.length - 1
		let j = adapterEvents.length - 1
		while (j >= 0 && i >= 0) {
			if (adapterEvents[j].date.isBefore(events[i].date)) {
				events.splice(i + 1, 0, adapterEvents[j])
				j--
			} else {
				i--
			}
		}
		if (j >= 0) {
			events.splice(0, 0, ...adapterEvents.slice(0, j + 1))
		}
	}))

	return _ => events
}

module.exports = generator;