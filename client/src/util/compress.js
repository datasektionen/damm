import imageCompression from 'browser-image-compression';
/*
    This file contains the image compress function used to compress patch images.
    A compressed image is generated per patch and is displayed in archive. The original is displayed
    on the detailed patch page.

    Why is compression done on the front end? I realised after some test deployments on the production server
    that we needed to compress the files. The way the backend is structured with GridFS it is not possible to compress
    images server side. Hence we need to do it front end... :D
*/

export default async function compress(image) {
    if (!image) return null

    const compressOptions = {
        // Compress to a maximum size of 0.02 MB
        // This makes the low res about 98% smaller but still looks good in archive.
        maxSizeMB: 0.020,
        maxWidthOrHeight: 300, //pixels
    }

    try {
        const compressed = await imageCompression(image, compressOptions)
        compressed.name = "compressed-" + compressed.name
        return compressed
    } catch (err) {
        console.log(err)
        return null
    }
}