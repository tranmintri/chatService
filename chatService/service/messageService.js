const {Message} = require('../models/chat');
const admin = require("firebase-admin")
const {db} = require('../config/firebase')
const {getChatData}= require('../service/chatService')
const { v4: uuidv4 } = require('uuid');
const {findById,save} = require("./chatService");

const addMessageOneByOne = async (chatId,messageData) => {
    await db.collection('Chats')
        .doc(chatId)
        .update({
            messages: admin.firestore.FieldValue.arrayUnion({
                messageId: messageData.newMessage.messageId,
                senderId: messageData.newMessage.senderId,
                senderName: messageData.newMessage.senderName,
                senderPicture:messageData.newMessage.senderPicture,
                type:messageData.newMessage.type,
                content: messageData.newMessage.content,
                timestamp: messageData.newMessage.timestamp,
                status: "sent"
            })
        });
    return 'Record saved successfully'
};
const removeAtYourSide = async (chatId, messageId) => {
    if (!chatId || !messageId) {
        throw new Error('Invalid request. chatId, messageId, and newStatus are required.');
    }
    console.log("removeAtYourSide")
    const chatData = await getChatData('Chats', chatId);

    const messages = chatData.messages || [];

    // Find the message with the specified ID and update its status
    const updatedMessages = messages.map(message => {
        if (message.messageId === messageId) {
            return { ...message, status: "removed" };
        }
        return message;
    });

    // Update the chat document with the modified array
    await db.collection('Chats').doc(chatId).update({ messages: updatedMessages });

    console.log('Message status updated successfully.');
    return 'Message status updated successfully.';
};
const shareMessage = async (data) => {
    const batch = db.batch(); // Khởi tạo batch để thực hiện nhiều thay đổi cùng một lúc
    console.log(data)
    const messageId = uuidv4()
    data.selectedGroups.forEach((chat) => {
        const chatRef = db.collection('Chats').doc(chat);
        batch.update(chatRef, {
            messages: admin.firestore.FieldValue.arrayUnion({
                messageId: messageId,
                senderId: data.shareMessage.senderId,
                senderName: data.shareMessage.senderName,
                senderPicture: data.shareMessage.senderPicture,
                type: "share " +data.shareMessage.type,
                content: data.shareMessage.content,
                timestamp: data.shareMessage.timestamp,
                status: "sent"
            })
        });
    });

     await batch.commit(); // Thực hiện các thay đổi một cách đồng thời

    return 'Record saved successfully';
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


module.exports = {addMessageOneByOne,findAll,deleteById,shareMessage,removeAtYourSide}