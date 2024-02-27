const admin = require('firebase-admin');
const credentials = require("../key.json");

admin.initializeApp({credential : admin.credential.cert(credentials)});
const db = admin.firestore()
const bucketName ="gs://chatservice-d1f1c.appspot.com"

const bucket = admin.storage().bucket(bucketName);


module.exports = {db,bucket };
