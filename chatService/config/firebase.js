const admin = require('firebase-admin');
const credentials = require("../key.json");
require("dotenv").config();

admin.initializeApp({
    credential : admin.credential.cert(credentials),
    storageBucket: process.env.BUCKET_NAME
});
const db = admin.firestore()
const bucket = admin.storage().bucket();

module.exports = {db,bucket };
