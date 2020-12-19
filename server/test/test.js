require('dotenv').config({path: "../.env"})
// VERY IMPORTANT LINE, DO NOT REMOVE
// Otherwise real db will be overwritten
process.env.NODE_ENV = "test"

const chai = require('chai')
const chaiHttp = require('chai-http');
const assert = require('assert');
const Märke = require('../models/Märke')
const app = require('../app')

const should = chai.should();
chai.use(chaiHttp)

describe("Patches", _ => {
    before(done => {
        Märke.deleteMany({}, err => {
            done()
        })
    })

    describe("/GET /api/marken", _ => {
        it("should get 0 patches", done => {
            chai.request(app)
            .get('/api/marken')
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a("array")
                res.body.length.should.be.eql(0)
                done()
            })
        })

        it("should get 1 patch", done => {
            Märke.create({
                name: "PUNG",
                description: "En beskrivning",
                date: "2020-12-19",
                image: "/api/file/aaaaaaaaaaaa",
                price: {type: "Ange pris", value: "10"},
                tags: [],
                createdBy: "",
                orders: [],
                files: [],
                produced: 0,
            })
            .then(_ => {
                chai.request(app)
                .get('/api/marken')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("array")
                    res.body.length.should.be.eql(1)
                    done()
                })
            })
            .catch(done)
        })

        it("should get no file info without token", done => {
            chai.request(app)
            .get('/api/marken')
            .end((err, res) => {
                res.body.forEach(patch => {
                    if (patch.files !== undefined) done(new Error("File field exists"))
                })
                done()
            })
        })

        it("should get file info with token", done => {
            chai.request(app)
            .get(`/api/marken?token=`)
            .end((err, res) => {
                return done()
                //TODO: ??
                // res.body.forEach(patch => {
                //     if (patch.files === undefined) done(new Error("File field exists"))
                // })
            })
        })
    })

    describe("/GET /api/marke/id/:id", _ => {
        it ("should get a patch", done => {
            Märke.findOne({}, (err, patch) => {
                if (err) return done(err)
                
                chai.request(app)
                .get(`/api/marke/id/${patch._id}`)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.name.should.be.a("string")
                    done()
                })
            })
        })

        it ("should get 404 from invalid ObjectID or non-existing id", done => {
            Märke.findOne({}, (err, patch) => {
                if (err) return done(err)
                
                chai.request(app)
                .get(`/api/marke/id/randomidsomejfinns`)
                .end((err, res) => {
                    res.should.have.status(404)
                    done()
                })
            })
        })

        it("should get no file info without token", done => {
            Märke.findOne({}, (err, patch) => {
                if (err) return done(err)
                
                chai.request(app)
                .get(`/api/marke/id/${patch._id}`)
                .end((err, res) => {
                    if (res.body.files !== undefined) {
                        console.log(res.body)
                        return done(new Error("File field exists"))
                    }
                    done()
                })
            })
        })

        it("should get file info with token", done => {
            done()
        })
    })
})
