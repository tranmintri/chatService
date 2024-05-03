const { v4: uuidv4 } = require('uuid');
const { reaction } = require('../models/reaction');
const { db } = require('../config/firebase');

const save = async (data) => {
    if (!data) {
        throw new Error('Reaction data is empty.');
    }

    console.log("Save Reaction:");
    console.log(data);



    await db.collection('Reactions').doc(data.reactionId).set({
        reactionId: data.reactionId,
        chatId: data.chatId,
        messageId: data.messageId,
        senderId: data.senderId,
        type: data.type,
        timestamp: data.timestamp
    });

    return 'Record saved successfully';
};
const update = async (data) => {
    try {
        console.log(data)
        const { chatId, messageId, reactionId, type,timestamp } = data;

        // Tìm kiếm phản ứng dựa trên chatId, messageId, và reactionId
        const querySnapshot = await db.collection('Reactions')
            .where('chatId', '==', chatId)
            .where('messageId', '==', messageId)
            .where('reactionId', '==', reactionId)
            .get();

        if (querySnapshot.empty) {
            throw new Error('Reaction not found for the given chatId, messageId, and reactionId.');
        }

        // Cập nhật phản ứng tìm thấy
        querySnapshot.forEach(async (doc) => {
            await doc.ref.update({
                type: type,
                timestamp: timestamp,
            });
        });

        return 'Record updated successfully';
    } catch (error) {
        console.error('Error updating reaction:', error);
        throw new Error('Error updating reaction.');
    }
};


const findAll = async () => {
    try {
        const snapshot = await db.collection('Reactions').get();
        const reactions = [];
        snapshot.forEach((doc) => {
            reactions.push({ ...doc.data()});
        });
        return reactions;
    } catch (error) {
        console.error('Error finding reactions:', error);
        throw new Error('Error finding reactions.');
    }
};

const remove = async (reactionId) => {
    console.log(reactionId)
    try {
        await db.collection('Reactions').doc(reactionId).delete();
        return 'Record deleted successfully';
    } catch (error) {
        console.error('Error deleting reaction:', error);
        throw new Error('Error deleting reaction.');
    }
};

const findByChatId = async (chatId) => {
    try {
        const querySnapshot = await db.collection('Reactions').where('chatId', '==', chatId).get();

        if (querySnapshot.empty) {
            return [];
        }

        const reactions = [];
        querySnapshot.forEach((doc) => {
            const reactionData = doc.data();
            reactions.push({
                reactionId: doc.id,
                chatId: reactionData.chatId,
                messageId: reactionData.messageId,
                senderId: reactionData.senderId,
                type: reactionData.type,
                timestamp: reactionData.timestamp,
            });
        });

        return reactions;
    } catch (error) {
        console.error('Error getting reactions by chatId:', error);
        throw new Error('Error getting reactions by chatId.');
    }
};


module.exports = { save, update, findAll, remove,findByChatId };
