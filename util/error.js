const error = (res, code = 500, message = "", err = "") => {
    let errorMessage
    if (process.env.NODE_ENV === "development") errorMessage = err.toString()
    return res.status(code).json({
        "error":message,
        "httpStatus":code,
        errorMessage
    })
}

const error500 = (res, err = "") => {
    error(res, 500, "Something went wrong", err)
}

module.exports = {
    error,
    error500
}