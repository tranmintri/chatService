'use strict';

const {save,findAll,findById,addParticipant,deleteById} = require("../service/chatService")
const addChats = async (req, res, next) => {
    try {
        const data = req.body;

        console.log(data)

        const result = await save(data);
        res.status(200).send(result);
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
    const { chatId } = req.params;

    try {
        const result = await findById('Chats', chatId);

        if (result) {
            res.status(200).json(result);
            console.log(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const addUserInChat = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const  userId  = req.body;

        await addParticipant(chatId,userId);

        console.log('userId added to conversation successfully.');
        res.status(200).json({ success: true, message: 'userId added to conversation successfully.' });
    } catch (error) {
        console.error('Error adding userId to conversation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const deleteChatById = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const  userId  = req.body;
        await deleteById(chatId,userId)
        console.log('Delete successfully.');
        res.status(200).json({ success: true, message: 'Delete successfully.' });
    } catch (error) {
        console.error('Error delete to conversation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    addChats,
    getAllChats,
    getChatById,
    addUserInChat,
    deleteChatById
}