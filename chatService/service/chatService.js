const { v4: uuidv4 } = require('uuid');
const {Conversation, Message} = require('../models/chat');
const admin = require("firebase-admin")
const {db} = require('../config/firebase')
const save = async (data) => {
    // Kiểm tra xem newConversation.messages có dữ liệu hay không
    if (!data) {
        throw new Error('Conversation is empty.');
    }
    console.log("chat service")
    // Thêm dữ liệu vào Firestore nếu có dữ liệu messages
    await db.collection('Chats').doc(data.chatId).set(data);
    return "success";
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
                doc.data().deleteId,
                doc.data().type
            );
            chatsArrays.push(conversation);
        });
       return chatsArrays
    }
};
const findById = async (chatId) => {
console.log(chatId)
    const chatData = await getChatData('Chats', chatId);
    console.log("a")
console.log(chatData)

    if (chatData) {
        return chatData
    } else {
       return null;
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


const getChatsByOneParticipantID = async (participantId) => {
    const chats = [];
    try {
        // Tìm các cuộc trò chuyện mà người dùng tham gia
        const snapshot = await db.collection('Chats')
            .where('participants', 'array-contains', participantId)
            .get();

        // Tạo một mảng để lưu trữ các cuộc trò chuyện


        // Lặp qua từng tài liệu trong snapshot
        snapshot.forEach((doc) => {
            // Lấy dữ liệu của cuộc trò chuyện và thêm vào mảng chats

                chats.push(doc.data());

        });
        return chats
    } catch (error) {
        throw new Error('Error getting chats by participant ID:', error);
    }
};
const getChatsByParticipants = async (participants) => {
    try {
        // Sắp xếp mảng participants trước khi truy vấn
        participants.sort();
        let chat = {}
        // Tìm các cuộc trò chuyện mà người dùng tham gia
        const snapshot = await db.collection('Chats')
            .where('participants', 'array-contains-any', participants)
            .get();

        if (snapshot.empty) {
            const name = "none"
            const chatId = uuidv4();
            const data = { chatId, name, participants }
            save(data)
            return data;
        } else {
            const chats = [];
            // Lặp qua từng tài liệu trong snapshot
            snapshot.forEach((doc) => {
                // Lấy dữ liệu của cuộc trò chuyện và thêm vào mảng chats
                console.log(doc.data())
                chat = doc.data();
            });
            return chat
        }
    } catch (error) {
        throw new Error('Error getting chats by participants:', error);
    }
};




module.exports = {save,findAll,findById,addParticipant,deleteById,getChatData,getChatsByOneParticipantID,getChatsByParticipants}