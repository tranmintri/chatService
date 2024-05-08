'use strict';

const {
    save,
    findAll,
    findById,
    addParticipant,
    deleteById,
    getChatsByOneParticipantID,
    getChatsByParticipants,
    updateRoleInChat,
    updateChat_Info
} = require("../service/chatService")
const {v4: uuidv4} = require("uuid");
const addChats = async (req, res, next) => {
    try {
        const data = req.body;
        let chatId = ""
        if (data.type === "public") {
            chatId = uuidv4();
        } else {
            chatId = data.chatId;
        }
        const chatData = {
            chatId: chatId,
            name: data.name,
            picture: data.picture,
            participants: data.participants,
            messages: data.messages,
            type: data.type,
            deleteId: null,
            managerId: data.managerId
        }
        console.log(data)

        const result = save(chatData);

        res.status(200).send({data: chatData, msg: result});
    } catch (error) {
        console.error('Error adding document:', error);
        res.status(500).send('Internal Server Error');
    }
};

const getAllChats = async (req, res, next) => {
    try {
        const result = await findAll();
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const getChatById = async (req, res, next) => {
    const {chatId} = req.params;

    try {
        const result = await findById(chatId);
        if (result) {
            res.status(200).json(result);
            // console.log(result);
        } else {
            res.status(404).json({msg: "Chat not found"});
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}
const addUserInChat = async (req, res, next) => {
    try {
        const {chatId} = req.params;
        const memberAdd = req.body;

        await addParticipant(chatId, memberAdd);

        console.log('userId added to conversation successfully.');
        res.status(200).json({success: true, message: 'userId added to conversation successfully.'});
    } catch (error) {
        console.error('Error adding userId to conversation:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};
const deleteChatById = async (req, res, next) => {
    try {
        const {chatId} = req.params;
        const userId = req.body;
        await deleteById(chatId, userId)
        console.log('Delete successfully.');
        res.status(200).json({success: true, message: 'Delete successfully.'});
    } catch (error) {
        console.error('Error delete to conversation:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};
const UpdateRole = async (req, res, next) => {
    try {
        const {chatId, userId} = req.params;

        await updateRoleInChat(chatId, userId)
        console.log('Delete successfully.');
        res.status(200).json({success: true, message: 'Delete successfully.'});
    } catch (error) {
        console.error('Error delete to conversation:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};
const getChatsByParticipantId = async (req, res, next) => {
    try {
        const {participantId} = req.params;
        const chats = await getChatsByOneParticipantID(participantId);
        res.json(chats);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};
const findChatsByParticipants = async (req, res, next) => {
    try {
        const {participants} = req.body;
        const chat = await getChatsByParticipants(participants);

        res.json(chat);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

const multer = require('multer');
const upload = multer()
const uploadChatInfo = upload.single("image")
const {bucket} = require('../config/firebase')
const updateChatInfo = async (req, res, next) => {
    try {
        // Thực hiện xử lý upload ảnh từ client
        uploadChatInfo(req, res, async (err) => {
            if (err) {
                console.error('Error uploading fordata:', err);
                return res.status(500).json({error: 'Internal Server Error'});
            }
            // Lấy thông tin ảnh và tin nhắn từ request

            const image = req.file
            const name = req.body.name
            const {chatId} = req.params;

            // Lưu ảnh vào Firebase Storage và lấy đường dẫn
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
            await updateChat_Info(chatId,name,url)

            res.status(200).json({success: true, data: url});
        });
    } catch (error) {
        console.error('Error adding message to conversation:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

module.exports = {
    addChats,
    getAllChats,
    getChatById,
    addUserInChat,
    deleteChatById,
    getChatsByParticipantId,
    findChatsByParticipants,
    UpdateRole,
    updateChatInfo
}