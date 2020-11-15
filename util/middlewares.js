const {error} = require('./error')

// Middleware that checks if token is in the request as a query
// For example https://damm.datasektionen.se/api/event/id/1337?token=ABCABCABC
const hasToken = (req, res, next) => {

    if (!req.query.token || req.query.token === "") {
        return error(res, 403, "No token provided")
    }
    next()
}

module.exports = {
    hasToken,
}