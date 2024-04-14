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
                doc.data().picture,
                doc.data().participants,
                doc.data().messages,
                doc.data().type,
                doc.data().deleteId,
                doc.data().managerId
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
const addParticipant = async (chatId, memberAdd) => {
    // Lấy thông tin tài liệu chat từ Firestore
    const chatDoc = await db.collection('Chats').doc(chatId).get();

    if (chatDoc.exists) {
        // Lấy mảng participants từ tài liệu chat
        const participants = chatDoc.data().participants || [];

        // Tạo mảng mới bằng cách kết hợp participants và memberAdd, loại bỏ các giá trị trùng lặp
        const updatedParticipants = [...new Set([...participants, ...memberAdd])];

        // Cập nhật mảng participants mới vào tài liệu chat
        await db.collection('Chats').doc(chatId).update({
            participants: updatedParticipants
        });
    } else {
        console.error('Chat document not found');
    }
};

const deleteById = async (chatId,userId) => {

    await db.collection('Chats')
        .doc(chatId)
        .update({
            deleteId: userId
        });
};

const updateRoleInChat = async (chatId,userId) => {
    console.log("update Role")
    await db.collection('Chats')
        .doc(chatId)
        .update({
            managerId: userId
        });
};


const getChatsByOneParticipantID = async (participantId) => {
    const chats = [];
    try {
        // Tìm các cuộc trò chuyện mà người dùng tham gia
        const snapshot = await db.collection('Chats')
            .where('participants', 'array-contains', participantId)
            .get();

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
                chat = doc.data();
            });
            return chat
        }
    } catch (error) {
        throw new Error('Error getting chats by participants:', error);
    }
};
module.exports = {save,findAll,findById,addParticipant,deleteById,getChatData,getChatsByOneParticipantID,getChatsByParticipants,updateRoleInChat}
