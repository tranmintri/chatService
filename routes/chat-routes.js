const express = require('express');
const {addChats,getAllChats,getChatById,addUserInChat,
    deleteChatById

      } = require('../controllers/chatController');

const router = express.Router();

//save chat
router.post('/chats', addChats);
//get all chat
router.get('/chats', getAllChats);
// //get chat by id
router.get('/chats/:chatId', getChatById);
// //update chat
router.put('/chats/:chatId', addUserInChat);
// //delete chat
router.delete('/chats/:chatId', deleteChatById);

// //send message in chat
// router.post('/chats/:chatId/messages', addConversation);
// //get all message in chat
// router.get('/chats/:chatId/messages', addConversation);
// //get message by id in chat
// router.get('/chats/:chatId/messages/:messageId', addConversation);

module.exports = {
    routes: router
}