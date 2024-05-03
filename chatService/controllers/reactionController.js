// addReaction,updateReaction,getAllReaction,deleteReactionById
'use strict';
const admin = require("firebase-admin")
const {db} = require('../config/firebase')
const {save,findAll,remove,update,findByChatId} = require("../service/reactionService");


const addReaction= async (req, res, next) => {

    try {
        const data = req.body;
        console.log("reaction controler")
        console.log(data)
        // Kiểm tra xem newConversation.messages có dữ liệu hay không
        if (!data) {
            throw new Error('reaction data are required.');
        }
        // Thêm dữ liệu vào Firestore nếu có dữ liệu messages
        const result = await save(data)
        res.json({data:result,status:true});
    } catch (error) {
        res.json(error.message);
    }
}

const updateReaction= async (req, res, next) => {
    try {
        const data = req.body;
        console.log(data)
        // Kiểm tra xem newConversation.messages có dữ liệu hay không
        if (!data) {
            throw new Error('reaction data are required.');
        }
        // Thêm dữ liệu vào Firestore nếu có dữ liệu messages
        const result = await update(data)
        res.json({data:result,status:true});
    } catch (error) {
        res.json(error.message);
    }
}

const getAllReaction = async (req, res, next) => {
    try {
        const result = await findAll();
        if (result) {
            res.status(200).json({data:result,status:true});
            console.log(result);
        } else {
            res.json({msg:"reaction not found",status:false});
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const getReactionByChatId = async (req, res, next) => {
    try {
        const {chatId} = req.params
        const result = await findByChatId(chatId);
        if (result) {
            res.status(200).json({data:result,status:true});
            console.log(result);
        } else {
            res.json({msg:"reaction not found",status:false});
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const deleteReactionById = async (req, res, next) => {
    const { reactionId } = req.params; // Lấy reactionId từ params của request
    console.log(reactionId)
    try {
        const result = await remove(reactionId);

        res.status(200).json({ message: result });
    } catch (error) {
        console.error('Error deleting reaction:', error);
        res.status(500).json({ error: 'Error deleting reaction' });
    }
}

module.exports = {addReaction,updateReaction,getAllReaction,deleteReactionById,getReactionByChatId}