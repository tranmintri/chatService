const {Message} = require('../models/chat');
const admin = require("firebase-admin")
const {db} = require('../config/firebase')
const {getChatData}= require('../service/chatService')
const save = async (chatId,newMessage) => {
    // Kiểm tra xem newConversation.messages có dữ liệu hay không
    await db.collection('Chats')
        .doc(chatId)
        .update({
            messages: admin.firestore.FieldValue.arrayUnion({
                messageId: newMessage.messageId,
                senderId: newMessage.senderId,
                content: newMessage.content,
                timestamp: newMessage.timestamp
            })
        });
};
const findAll = async (chatId) => {

    const chatData = await getChatData('Chats', chatId);
    const messagesArray = [];
    if (chatData.messages == null)
        throw new Error('No Message In Chat')
    else {
        chatData.messages.forEach(doc => {
            const message = new Message(
                doc.messageId,
                doc.senderId,
                doc.content,
                doc.timestamp,
            );
            messagesArray.push(message);
        });
        return messagesArray
    }
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


module.exports = {save,findAll,deleteById}