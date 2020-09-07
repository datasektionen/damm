const fetch = require('node-fetch')
//Configure process.env
require('dotenv').config()
var db = require('./model')

exports.adminAuth = (req, res, next) => {
    const token = req.query.token
    //If token provided
    if (token) {
        //Verify token with login2
        fetch(`https://login2.datasektionen.se/verify/${token}.json?api_key=${process.env.LOGIN2_API_KEY}`)
        .then(x => x.json())
        .then(json => {
            console.log(json)

            //Check pls if user has admin access
            fetch(`https://pls.datasektionen.se/api/user/${json.user}/damm`)
            .then(response => response.json())
            .then(y => {
                if (!y.includes('admin')) {
                    res.status(403).send("No admin, no access.")
                    return
                } else {
                    next()
                    // return
                }
            })
            .catch(err => {
                console.log("Pls error: ", err)
                res.status(500).send(err)
                return
            })
        })
        .catch(err => {
            console.log("Token error")
            res.status(500).send(err)
            return
        })
    //No token provided
    } else {
        res.status(401).send("No token provided")
    }
}

//Check if the user has admin access via pls
exports.isAdmin = (token) => {
    return new Promise((resolve, reject) => {
        fetch(`https://login2.datasektionen.se/verify/${token}.json?api_key=${process.env.LOGIN2_API_KEY}`)
        .then(res => res.json())
        .then(json => {
            console.log(json)

            db.User.createFromLogin(json, (user) => {
                console.log(user)
                fetch(`https://pls.datasektionen.se/api/user/${json.user}/damm`)
                .then(res => res.json())
                .then(json => resolve(json.includes('admin') ? true : false))
                .catch(err => {
                    console.log("Error fetching: ", err)
                    return reject(err)
                })

            })

        })
        .catch(err => {
            console.log(err)
            reject(err)
        })
    })
}