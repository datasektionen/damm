const FILE_ROUTE = "/api/file"
const FILE_ENDPOINT = FILE_ROUTE + "/:filename"
const createFileURL = filename => {
    return FILE_ENDPOINT.replace(/\:filename/, filename)
}
const URLToFilename = url => {
    return url.split(FILE_ROUTE + "/")[1]
}

module.exports = {
    FILE_ROUTE,
    FILE_ENDPOINT,
    createFileURL,
    URLToFilename,
}