/*
    Dauth - authorization middlewares

    This file includes some authorization middlewares that are used on endpoints where admin
    rights are needed to perform an action. It also includes functions that gets pls rights
    of a user and a function that gets a user from a token.
*/

const fetch = require('node-fetch')
const {error, error500} = require('./util/error')

const User = require('./models/User')

exports.adminAuth = (req, res, next) => {
    const token = req.query.token
    //If token provided
    if (token) {

        // When testing
        if (process.env.NODE_ENV === "test") {
            if (token === "admintoken") return next()
            else return error(res, 401, "No admin, no access")
        }

        //Verify token with login2
        fetch(`${process.env.LOGIN2_URL}/verify/${token}.json?api_key=${process.env.LOGIN2_API_KEY}`)
        .then(x => x.json())
        .then(json => {

            //Check pls if user has admin access
            fetch(`${process.env.PLS_API_URL}/user/${json.user}/damm`)
            .then(response => response.json())
            .then(y => {
                if (!y.includes('admin')) {
                    return error(res, 401, "No admin, no access.")
                } else {
                    next()
                    // return
                }
            })
            .catch(err => {
                console.log("Pls error: ", err)
                return error(res, 500, "Invalid token", err)
            })
        })
        .catch(err => {
            console.log("Login error", err)
            return error(res, 500, "Invalid token", err)
        })
    //No token provided
    } else {
        return error(res, 403, "No token provided")
    }
}

exports.patchesAuth = (req, res, next) => {
    const token = req.query.token
    //If token provided
    if (token) {

        // When testing
        if (process.env.NODE_ENV === "test") {
            if (token === "admintoken") return next()
            else if (token === "prylistoken") return next()
            else return error(res, 401, "No admin, no access")
        }

        //Verify token with login2
        fetch(`${process.env.LOGIN2_URL}/verify/${token}.json?api_key=${process.env.LOGIN2_API_KEY}`)
        .then(x => x.json())
        .then(json => {
            // console.log(json)

            //Check pls if user has admin access
            fetch(`${process.env.PLS_API_URL}/user/${json.user}/damm`)
            .then(response => response.json())
            .then(y => {
                if (y.includes('admin') || y.includes("prylis")) {
                    next()
                } else {
                    return error(res, 401, "Unauthorized.")
                }
            })
            .catch(err => {
                console.log("Pls error: ", err)
                return error500(res, err)
            })
        })
        .catch(err => {
            console.log("Token error")
            return error500(res, err)
        })
    //No token provided
    } else {
        return error(res, 403, "No token provided.")
    }
}

//Check the user's pls access rights
exports.getPls = (token) => {
    return new Promise((resolve, reject) => {
        // When testing
        if (process.env.NODE_ENV === "test") {
            // Our admin token when testing
            if (token === "admintoken") return resolve(["admin"])
            else if (token === "prylistoken") return resolve(["prylis"])
            // No access
            else return resolve([])
        }

        fetch(`${process.env.LOGIN2_URL}/verify/${token}.json?api_key=${process.env.LOGIN2_API_KEY}`)
        .then(res => res.json())
        .then(json => {
            const { first_name, last_name, user, ugkthid, emails } = json

            User.createFromLogin({first_name, last_name, user, ugkthid, emails}, (user) => {
                // User created or already exists
                // Users are used in our model when creating events.
            })
            
            fetch(`${process.env.PLS_API_URL}/user/${json.user}/damm`)
            .then(res => res.json())
            .then(json => resolve(json))
            .catch(err => {
                console.log("Error fetching: ", err)
                return reject(err)
            })
        })
        .catch(err => {
            console.log(err)
            reject(err)
        })
    })
}

exports.getUser = token => {
    return new Promise((resolve, reject) => {
        fetch(`${process.env.LOGIN2_URL}/verify/${token}.json?api_key=${process.env.LOGIN2_API_KEY}`)
        .then(res => res.json())
        .then(json => {
            User.findOne({ugkthid: json.ugkthid}, (err, res) => {
                if (err) {
                    reject(null)
                    console.log(err)
                }
                resolve(res)
            })
        })
        .catch(err => {
            console.log(err)
            reject(null)
        })
    })
}