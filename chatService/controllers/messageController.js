'use strict';

const {findAll,addMessageOneByOne,deleteById} = require("../service/messageService");
const {Message} = require("../models/chat");
const multer = require('multer');
const upload = multer();


// const  upload1
const uploadImages = upload.array('images');
const getAllMessageInChat = async (req, res, next) => {
    const { chatId } = req.params;
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
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            // Lấy thông tin ảnh và tin nhắn từ request
            const images = req.files;
            const message = req.body.message;

            if (!message && images.length === 0) {
                return res.status(400).json({ error: 'Message and images are missing' });
            }
            const { chatId } = req.params;

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
                imageContent+=url + "|"
            });
            await Promise.all(uploadPromises);
            res.status(200).json({ success: true, data: imageContent });
        });
    } catch (error) {
        console.error('Error adding message to conversation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const saveMessageInChat = async (req, res, next) => {

    try {
        const { chatId } = req.params;
        const  messageData  = req.body;
        console.log("control")
        console.log(messageData)
        const result = await addMessageOneByOne(chatId,messageData)
        if(result){
            res.status(200).json({ success: true, data:messageData });
        }
    } catch (error) {
        console.error('Error adding message to conversation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const deleteMessageByIdInChat = async (req, res, next) => {
    try {
        const { chatId, messageId } = req.params;
        const result = await deleteById(chatId,messageId)

        res.status(200).json(result)
        // Check if chatId and messageId are provided

    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    saveImageInChat,
    saveMessageInChat,
    getAllMessageInChat,
    deleteMessageByIdInChat
}