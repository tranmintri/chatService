const express = require('express');
const {saveMessageInChat,getAllMessageInChat,saveImageInChat,
    deleteMessageByIdInChat,saveFileInChat,share_Message

} = require('../controllers/messageController');

const router = express.Router();

//send message in chat
router.put('/:chatId/messages', saveMessageInChat);
router.post('/:chatId/images', saveImageInChat);
router.post('/:chatId/files', saveFileInChat);
router.post('/share-message', share_Message);
//get all message in chat
router.get('/:chatId/messages', getAllMessageInChat);
//get message by id in chat
// router.get('/:chatId/messages/:messageId', addConversation);
router.delete('/:chatId/messages/:messageId', deleteMessageByIdInChat);
module.exports = {
    routes: router
}