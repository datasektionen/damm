let multer = require('multer')
let GridFsStorage = require('multer-gridfs-storage')
const uuid4 = require('uuid4')

let MONGO_URL
// Do not test on real database when testing
if (process.env.NODE_ENV === "test") {
    //VERY important to not change this line to the real db, it will get overwriten... 
    MONGO_URL = "mongodb://localhost/damm-testdb"
} else MONGO_URL = process.env.MONGO_URL

let storage = GridFsStorage({
    url: MONGO_URL,
    file: (req, file) => {
        if (file.fieldname === "files") return {
            filename: "patch-file-" + uuid4()
        }
        else return {
            filename: "patch-image-" + uuid4()
        }
    },
    root: 'files',
    options: { useUnifiedTopology: true },
})

let upload = multer({
    storage,
    limits: {
        // Max file size of 10 MB
        // https://serverfault.com/questions/814767/413-request-entity-too-large-in-nginx-with-client-max-body-size-set
        // Is also set in nginx.conf at sips. If file is bigger than this value, a HTTP 413 is generated.
        fileSize: 1024*1024*10
    },
    fileFilter: (req, file, callback) => {
        // TODO: VERY IMPORTANT: Check mimebytes of file to see if it really is an image
        // Right now you can rename an image to .png and fool the system. Is a secrity risk, however
        // only admins can upload
        // Update: doesn't seem to be possible in here, since "file" in here is just an object with metadata, can't read first bytes
        
        // Not the patch image, allow all files
        if (file.fieldname === "files") return callback(null, true)

        // When creating a patch: The error is caught in the hasFile middleware
        // When editing, there is no need to send a file (if we don't want to replace image). If you therefore
        // send an invalid file we just skip it. If you send a valid one it is updated.
        if (file.mimetype !== "image/png" && file.mimetype !== "image/jpeg") {
            // Skips uploading the file
            return callback(null, false)
        }
        else callback(null, true)
    }
})
module.exports = upload
