const {bucket} = require('../config/firebase')
async function uploadImage(imageBuffer, imageName, contentType) {
    try {
        await bucket.file(`images/${imageName}`).save(imageBuffer, {
            metadata: { contentType: contentType } // Set the content type depending on your image format
        });

        console.log(`Image uploaded to images/${imageName}`);
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

async function uploadFile(fileBuffer, fileName, contentType) {
    try {
        await bucket.file(`files/${fileName}`).save(fileBuffer, {
            metadata: { contentType: contentType } // Set the content type depending on your file format
        });

        console.log(`File uploaded to files/${fileName}`);
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}

async function getFile(fileName) {
    try {
        const [file] = await bucket.file(`files/${fileName}`).download();
        return file;
    } catch (error) {
        console.error('Error downloading file:', error);
        throw error;
    }
}

async function getImage(imageName) {
    try {
        const [image] = await bucket.file(`images/${imageName}`).download();
        return image;
    } catch (error) {
        console.error('Error downloading image:', error);
        throw error;
    }
}
module.exports = { uploadImage, getFile, getImage,uploadFile };