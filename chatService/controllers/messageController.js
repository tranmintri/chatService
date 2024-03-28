'use strict';

const {findAll,addMessageOneByOne,deleteById} = require("../service/messageService");
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

        const  messageData  = req.body;
        const result = await addMessageOneByOne(chatId,messageData)
        if(result){
            res.status(200).json({ success: true, data: messageData });
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
    saveMessageInChat,
    getAllMessageInChat,
    deleteMessageByIdInChat
}