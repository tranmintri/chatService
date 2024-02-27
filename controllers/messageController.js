'use strict';

const {findAll,save,deleteById} = require("../service/messageService");
const {Message} = require("../models/chat");
const getAllMessageInChat = async (req, res, next) => {
    const { chatId } = req.params;
    try {
        const result = await findAll(chatId)
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send('Error');
    }
}

const saveMessageInChat = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const  newMessage  = req.body;
        const messageId = uuidv4();

        const message = new Message(messageId,newMessage.type,newMessage.senderId,newMessage.contents,newMessage.timestamp)
        await save(chatId,message)

        console.log('Message added to conversation successfully.');
        res.status(200).json({ success: true, message: 'Message added to conversation successfully.' });
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
    saveMessageInChat,
    getAllMessageInChat,
    deleteMessageByIdInChat
}