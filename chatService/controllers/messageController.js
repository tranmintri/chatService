'use strict';

const {findAll, addMessageOneByOne, deleteById, shareMessage, removeAtYourSide} = require("../service/messageService");
const {Message} = require("../models/chat");
const multer = require('multer');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const { Readable } = require("stream");

// Create S3 client
const s3Client = new S3Client({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
});

// Create a multer storage engine for handling file uploads
const storage = multer.memoryStorage();
const uploadRecord = multer({ storage }).single("record");

const saveRecordInChat = async (req, res) => {
    try {
        uploadRecord(req, res, async (err) => {
            if (err) {
                console.error("Error uploading file:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }

            if (!req.file) {
                return res.status(400).send("No file uploaded.");
            }

            const fileContent = req.file.buffer;
            const fileName = `${Date.now()}_${req.file.originalname}`;
            const bucketName = process.env.S3_BUCKET_NAME;

            // Create a readable stream from the file content
            const stream = Readable.from(fileContent);

            // Set up the parameters for the PutObjectCommand
            const params = {
                Bucket: bucketName,
                Key: `record/${fileName}`,
                Body: stream,
                ACL: "public-read",
                ContentType: req.file.mimetype,
            };

            // Use Upload from @aws-sdk/lib-storage to upload the file to S3
            const uploader = new Upload({
                client: s3Client,
                params,
            });

            // Perform the upload
            const result = await uploader.done();

            // Get the public URL of the uploaded file
            const fileUrl = `https://${bucketName}.s3.${process.env.REGION}.amazonaws.com/${params.Key}`;

            console.log("File uploaded to Amazon S3.", fileUrl);
            res.status(200).json({ url: fileUrl });
        });
    } catch (error) {
        console.error("Error handling upload:", error);
        res.status(500).send("Error handling upload.");
    }
};

// Định nghĩa route để gửi file từ client lên S3

const upload = multer()
// const  upload1
const uploadImages = upload.array('images');

const getAllMessageInChat = async (req, res, next) => {
    const {chatId} = req.params;
    try {
        const result = await findAll(chatId)
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send('Error');
    }
}
const {bucket} = require('../config/firebase')
const saveImageInChat = async (req, res, next) => {
    try {
        // Thực hiện xử lý upload ảnh từ client
        uploadImages(req, res, async (err) => {
            if (err) {
                console.error('Error uploading images:', err);
                return res.status(500).json({error: 'Internal Server Error'});
            }
            // Lấy thông tin ảnh và tin nhắn từ request
            const images = req.files;

            if (images.length === 0) {
                return res.status(400).json({error: 'Message and images are missing'});
            }
            const {chatId} = req.params;

            // Tạo một mảng để lưu đường dẫn của các ảnh
            const imageUrls = [];
            let imageContent = ""
            // Lưu ảnh vào Firebase Storage và lấy đường dẫn
            const uploadPromises = images.map(async (image) => {
                const fileName = `images/${Date.now()}-${image.originalname}`; // Đường dẫn tới thư mục "images"
                const file = bucket.file(fileName);

                await file.save(image.buffer, {
                    metadata: {
                        contentType: image.mimetype
                    }
                });
                const [url] = await file.getSignedUrl({
                    action: 'read',
                    expires: '01-01-2500' // Thời gian hết hạn của URL
                });
                console.log(url)
                // Lưu đường dẫn của ảnh vào mảng imageUrls
                imageContent += url + "|"
            });
            await Promise.all(uploadPromises);
            res.status(200).json({success: true, data: imageContent});
        });
    } catch (error) {
        console.error('Error adding message to conversation:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};
const uploadFiles = upload.array('files');
const saveFileInChat = async (req, res, next) => {
    try {
        // Thực hiện xử lý upload file từ client
        uploadFiles(req, res, async (err) => {
            if (err) {
                console.error('Error uploading files:', err);
                return res.status(500).json({error: 'Internal Server Error'});
            }
            // Kiểm tra xem có tệp được tải lên không
            if (!req.files || req.files.length === 0) {
                console.error('No files uploaded');
                return res.status(400).json({error: 'No files uploaded'});
            }
            // Lấy thông tin các file từ request
            const files = req.files;
            console.log(files)
            const fileUrls = [];
            let fileContent = ""
            // Lưu các file vào Firebase Storage và lấy đường dẫn
            for (let file of files) {
                const fileUploadPath = `files/${decodeURIComponent(file.originalname)}`;// Đường dẫn tới thư mục "files"
                const fileRef = bucket.file(fileUploadPath);
                await fileRef.save(file.buffer, {
                    metadata: {
                        contentType: file.mimetype
                    }
                });

                const [url] = await fileRef.getSignedUrl({action: 'read', expires: '03-09-2491'});
                console.log(url)
                fileContent += url + "|"
            }

            // Trả về mảng các URL của các file đã được tải lên
            res.status(200).json({data: fileContent});
        });
    } catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};


const saveMessageInChat = async (req, res, next) => {

    try {
        const {chatId} = req.params;
        const messageData = req.body;
        console.log("control")
        console.log(messageData)

        const result = await addMessageOneByOne(chatId, messageData)
        if (result) {
            res.status(200).json({success: true, data: messageData});
        }
    } catch (error) {
        console.error('Error adding message to conversation:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};
const remove_At_Your_Side = async (req, res, next) => {

    try {
        const {chatId, messageId} = req.params;

        const result = await removeAtYourSide(chatId, messageId)
        if (result) {
            res.status(200).json({success: true, data: result});
        }
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'});
    }
};
const share_Message = async (req, res, next) => {

    try {
        const data = req.body;
        console.log("share message")
        console.log(data)
        const result = await shareMessage(data)
        if (result) {
            res.status(200).json({success: true, data: data.shareMessage});
        }
    } catch (error) {
        console.error('Error adding message to conversation:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};
const deleteMessageByIdInChat = async (req, res, next) => {
    try {
        const {chatId, messageId} = req.params;
        const result = await deleteById(chatId, messageId)

        res.status(200).json(result)
        // Check if chatId and messageId are provided

    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

module.exports = {
    saveImageInChat,
    saveMessageInChat,
    getAllMessageInChat,
    deleteMessageByIdInChat,
    saveFileInChat,
    share_Message,
    remove_At_Your_Side,
    saveRecordInChat
}
