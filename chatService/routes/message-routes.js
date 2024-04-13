const express = require('express');
const {saveMessageInChat,getAllMessageInChat,saveImageInChat,
    deleteMessageByIdInChat,saveFileInChat,share_Message,remove_At_Your_Side,saveRecordInChat

} = require('../controllers/messageController');

const router = express.Router();

router.put('/:chatId/messages', saveMessageInChat);
router.post('/:chatId/images', saveImageInChat);
router.post('/:chatId/files', saveFileInChat);
router.post('/:chatId/record', saveRecordInChat);
router.post('/share-message', share_Message);
router.get('/:chatId/messages', getAllMessageInChat);
router.delete('/:chatId/messages/:messageId', deleteMessageByIdInChat);
router.put('/:chatId/messages/:messageId', remove_At_Your_Side);
module.exports = {
    routes: router
}