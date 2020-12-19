require('dotenv').config({path: "../.env"})
// VERY IMPORTANT LINE, DO NOT REMOVE
// Otherwise real db will be overwritten
process.env.NODE_ENV = "test"

const chai = require('chai')
const chaiHttp = require('chai-http');
const assert = require('assert');
const Märke = require('../models/Märke')
const app = require('../app')
const fs = require('fs')

const should = chai.should();
chai.use(chaiHttp)

describe("Patches", _ => {
    before(done => {
        Märke.deleteMany({}, err => {
            done()
        })
    })

    describe("GET /api/marken", _ => {
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
                    if (patch.files !== undefined) return done(new Error("File field exists"))
                })
                done()
            })
        })
    })

    describe("GET /api/marke/id/:id", _ => {
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
            Märke.findOne({}, (err, patch) => {
                if (err) return done(err)
                
                chai.request(app)
                .get(`/api/marke/id/${patch._id}?token=admintoken`)
                .end((err, res) => {
                    if (res.body.files === undefined) {
                        console.log(res.body)
                        return done(new Error("File field doesn't exists"))
                    }
                    done()
                })
            })
        })
    })

    describe("POST /api/admin/marke/create", _ => {
        const image = fs.readFileSync(`${__dirname}/PUNG.jpg`)
        const name = JSON.stringify("Test")
        const price = JSON.stringify({type: "Gratis", value: ""})

        describe("Unauthorized:", _ => {
            it("should fail with no token", done => {
                chai.request(app)
                .post(`/api/admin/marke/create`)
                .end((err, res) => {
                    res.should.have.status(403)
                    done()
                })
            })

            it("should fail when no admin", done => {
                chai.request(app)
                .post(`/api/admin/marke/create?token=pöbeln`)
                .end((err, res) => {
                    res.should.have.status(401)
                    done()
                })
            })
        })

        describe("Authorized:", _ => {

            it("should fail with no body", done => {
                chai.request(app)
                .post(`/api/admin/marke/create?token=admintoken`)
                .end((err, res) => {
                    res.should.have.status(403)
                    done()
                })
            })

            it("should fail with no image", done => {
                chai.request(app)
                .post(`/api/admin/marke/create?token=admintoken`)
                .field("name", name)
                .field("price", price)
                .end((err, res) => {
                    res.should.have.status(403)
                    done()
                })
            })

            it("should pass with image, name and price and is admin", done => {
                
                chai.request(app)
                .post(`/api/admin/marke/create?token=admintoken`)
                .attach("image", image, "PUNG.jpg")
                .field("name", name)
                .field("price", price)
                .end((err, res) => {
                    res.should.have.status(200)
                    done()
                })
            })

            it("should pass with image, name and price and is prylis", done => {
                
                chai.request(app)
                .post(`/api/admin/marke/create?token=prylistoken`)
                .attach("image", image, "PUNG.jpg")
                .field("name", name)
                .field("price", price)
                .end((err, res) => {
                    res.should.have.status(200)
                    done()
                })
            })

            describe("name", _ => {
                it("should fail with no name", done => {
                
                    chai.request(app)
                    .post(`/api/admin/marke/create?token=admintoken`)
                    .attach("image", image, "PUNG.jpg")
                    .field("price", price)
                    .end((err, res) => {
                        res.should.not.have.status(200)
                        done()
                    })
                })
                
                it("should fail when name is zero length", done => {
                    
                    chai.request(app)
                    .post(`/api/admin/marke/create?token=admintoken`)
                    .attach("image", image, "PUNG.jpg")
                    .field("name", JSON.stringify(""))
                    .field("price", price)
                    .end((err, res) => {
                        res.should.not.have.status(200)
                        done()
                    })
                })
    
                it("should fail when name is whitespace", done => {
                    
                    chai.request(app)
                    .post(`/api/admin/marke/create?token=admintoken`)
                    .attach("image", image, "PUNG.jpg")
                    .field("name", JSON.stringify("              \n          "))
                    .field("price", price)
                    .end((err, res) => {
                        res.should.not.have.status(200)
                        done()
                    })
                })
    
                it("should pass and trim name", done => {
                    
                    chai.request(app)
                    .post(`/api/admin/marke/create?token=admintoken`)
                    .attach("image", image, "PUNG.jpg")
                    .field("name", JSON.stringify("    a           \n        "))
                    .field("price", price)
                    .end((err, res) => {
                        assert(res.body.patch.name === "a")
                        res.should.have.status(200)
                        done()
                    })
                })
            })

            describe("price", _ => {
                it("should fail with no price", done => {
                    
                    chai.request(app)
                    .post(`/api/admin/marke/create?token=admintoken`)
                    .attach("image", image, "PUNG.jpg")
                    .field("name", name)
                    .end((err, res) => {
                        res.should.not.have.status(200)
                        done()
                    })
                })
    
                it("should fail when price is not an integer", done => {
                    
                    chai.request(app)
                    .post(`/api/admin/marke/create?token=admintoken`)
                    .attach("image", image, "PUNG.jpg")
                    .field("name", name)
                    .field("price", JSON.stringify({type: "Ange pris", value: "hej"}))
                    .end((err, res) => {
                        res.should.not.have.status(200)
                        done()
                    })
                })
    
                it("should fail when no price type given", done => {
                    
                    chai.request(app)
                    .post(`/api/admin/marke/create?token=admintoken`)
                    .attach("image", image, "PUNG.jpg")
                    .field("name", name)
                    .field("price", JSON.stringify({value: "hej"}))
                    .end((err, res) => {
                        res.should.not.have.status(200)
                        done()
                    })
                })
    
                it("should fail when price type is 'Ange pris' and no value set", done => {
                    
                    chai.request(app)
                    .post(`/api/admin/marke/create?token=admintoken`)
                    .attach("image", image, "PUNG.jpg")
                    .field("name", name)
                    .field("price", JSON.stringify({type: "Ange pris"}))
                    .end((err, res) => {
                        res.should.not.have.status(200)
                        done()
                    })
                })
    
                it("should fail when invalid price type", done => {
                    
                    chai.request(app)
                    .post(`/api/admin/marke/create?token=admintoken`)
                    .attach("image", image, "PUNG.jpg")
                    .field("name", name)
                    .field("price", JSON.stringify({type: "fjh40etj4rf3sr3s", value: ""}))
                    .end((err, res) => {
                        res.should.not.have.status(200)
                        done()
                    })
                })
            })

        })
    })

    describe("POST /api/admin/marke/edit/id/:id", _ => {

        it("should fail with no token", done => {
            chai.request(app)
            .post(`/api/admin/marke/edit/id/aaaa`)
            // .send(patchObj)
            .end((err, res) => {
                res.should.have.status(403)
                done()
            })
        })

        // it("should fail with invalid id", done => {
        //     chai.request(app)
        //     .post(`/api/admin/marke/edit/id/aaa?token=admintoken`)
        //     .field("name", JSON.stringify("test"))
        //     .end((err, res) => {
        //         console.log(res.error)
        //         res.should.have.status(404)
        //         done()
        //     })
        // })
    })
})
