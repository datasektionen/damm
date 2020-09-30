const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var eventSchema = new Schema({
    title: String,
    content: String,
    date: String,
    template: String
})

var Event = mongoose.model('Event', eventSchema)

// Event.create({title: "Media går under", content:"**Fungerar markdown?**\n\n# Hoppas det\n## Test\n- Lista\n- Lista2", date: "2020-10-01", template: "general"})

module.exports = Event