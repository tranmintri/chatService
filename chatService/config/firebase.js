const admin = require('firebase-admin');
const credentials = require("../key.json");
require("dotenv").config();

admin.initializeApp({
    credential : admin.credential.cert(credentials),
    storageBucket: process.env.BUCKET_NAME
});
const db = admin.firestore()
const bucket = admin.storage().bucket();
async function configureCors() {
    try {
        await bucket.setCorsConfiguration([
            {
                origin: ['http://localhost:3000', 'https://localhost:3000'],
                method: ['GET', 'POST', 'PUT', 'DELETE'],
                responseHeader: [
                    'Content-Type',
                    'Authorization',
                    'X-Requested-With',
                    'X-App-Version',
                    'X-App-Name',
                    'X-App-Platform'
                ],
                maxAgeSeconds: 3600 // Thời gian cache (ở đây là 1 giờ)
            }
        ]);
        console.log('CORS configuration set successfully!');
    } catch (error) {
        console.error('Error setting CORS configuration:', error);
    }
}

// Gọi hàm configureCors() để thực hiện cấu hình CORS khi ứng dụng khởi động
configureCors();

module.exports = {db,bucket };
