const {Message} = require('../models/chat');
const admin = require("firebase-admin")
const {db} = require('../config/firebase')
const {getChatData}= require('../service/chatService')
const { v4: uuidv4 } = require('uuid');
const {findById,save} = require("./chatService");

const addMessageOneByOne = async (chatId,messageData) => {
    const messageId = uuidv4();
    const getUser = onlineUsers.get(messageData.receiveId)
    await db.collection('Chats')
        .doc(chatId)
        .update({
            messages: admin.firestore.FieldValue.arrayUnion({
                messageId: messageId,
                senderId: messageData.newMessage.senderId,
                senderName: messageData.newMessage.senderName,
                senderPicture:messageData.newMessage.senderPicture,
                type:messageData.newMessage.type,
                content: messageData.newMessage.content,
                timestamp: messageData.newMessage.timestamp,
                status: getUser ? "delivered" : "sent"
            })
        });
    return 'Record saved successfully'
};

const findAll = async (chatId) => {

    const chatData = await getChatData('Chats', chatId);
    if(!chatData.messages){

        return [];
    }
    const messagesArray = [];
        chatData.messages.forEach(doc => {
            const message = new Message(
                doc.messageId,
                doc.type,
                doc.senderId,
                doc.senderName,
                doc.senderPicture,
                doc.content,
                doc.timestamp,
                doc.status
            );
            messagesArray.push(message);
        });
        return messagesArray

};
const deleteById = async (chatId,messageId) => {

    if (!chatId || !messageId) {
        throw new Error('Invalid request. chatId and messageId are required.');
    }

    const chatData = await getChatData('Chats', chatId);

    const messages = chatData.messages || [];

    // Remove the message with the specified ID from the array
    const updatedMessages = messages.filter(message => message.messageId != messageId);

    // Update the chat document with the modified array
    await db.collection('Chats').doc(chatId).update({ messages: updatedMessages });

    console.log('Message deleted successfully.');
    return 'Message deleted successfully.';
};


module.exports = {addMessageOneByOne,findAll,deleteById}