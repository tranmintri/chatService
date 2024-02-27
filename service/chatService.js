const { v4: uuidv4 } = require('uuid');
const {Conversation, Message} = require('../models/chat');
const admin = require("firebase-admin")
const {db} = require('../config/firebase')
const save = async (data) => {
    // Kiểm tra xem newConversation.messages có dữ liệu hay không
    if (!data || !data.messages || data.messages.length === 0) {
        throw new Error('Conversation messages are required.');
    }

    const chatId = uuidv4();
    const messageId = uuidv4();

    // Thêm dữ liệu vào Firestore nếu có dữ liệu messages
    await db.collection('Chats').doc(chatId).set({
        chatId: chatId,
        name: data.name,
        participants: data.participants,
        messages: data.messages.map(
            message => ({
                messageId: messageId,
                type: message.type,
                senderId: message.senderId,
                content: message.content,
                timestamp: message.timestamp
            })
        ),
        deleteId: null
    });

    return 'Record saved successfully';
};
const findAll = async () => {

    const chats = await db.collection('Chats');
    const data = await chats.get();
    const chatsArrays = [];
    if(data.empty) {
        throw new Error('Conversation is empty.');
    }else {
        data.forEach(doc => {
            const conversation = new Conversation(
                doc.data().chatId,
                doc.data().name,
                doc.data().participants,
                doc.data().messages,
                doc.data().deleteId
            );
            chatsArrays.push(conversation);
        });
       return chatsArrays
    }
};
const findById = async (chatId) => {

    const chatData = await getChatData('Chats', chatId);

    if (chatData) {
        return chatData

    } else {
       return 'Chat not found';
    }
};
const getChatData = async (collectionName, chatId) => {
    const documentRef = db.collection(collectionName).doc(chatId);

    try {
        const documentSnapshot = await documentRef.get();

        if (documentSnapshot.exists) {
            const documentData = documentSnapshot.data();
            return documentData;
        } else {
            console.log('Document not found.');
            return null;
        }
    } catch (error) {
        console.error('Error getting document:', error);
        throw error;
    }
}
const addParticipant = async (chatId,userId) => {

    await db.collection('Chats')
        .doc(chatId)
        .update({
            participants: admin.firestore.FieldValue.arrayUnion({
                userId
            })
        });
};
const deleteById = async (chatId,userId) => {

    await db.collection('Chats')
        .doc(chatId)
        .update({
            deleteId: userId
        });
};


module.exports = {save,findAll,findById,addParticipant,deleteById,getChatData}