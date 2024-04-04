const {v4: uuidv4} = require('uuid');
const {Conversation, Message} = require('../models/chat');
const admin = require("firebase-admin")
const {db} = require('../config/firebase')
const {User} = require("../models/user");
const { Kafka } = require('kafkajs');
const  {save :saveInChat} = require("./chatService")

// Khởi tạo Kafka broker
const kafka = new Kafka({
    clientId: 'user-consumer',
    brokers: ['localhost:9092']
});
const consumer = kafka.consumer({ groupId: 'user-group' });

const run = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'newuser' });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                topic,
                partition,
                offset: message.offset,
                value: message.value.toString(),

            });
            save(message.value)
        },
    });
};
run().catch(console.error);
function generateRandomNumberString(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10); // Sinh số ngẫu nhiên từ 0 đến 9 và thêm vào chuỗi
    }
    return result;
}
const findAll = async () => {

    const users = await db.collection('Users');
    const data = await users.get();
    const usersArrays = [];
    if (data.empty) {
        throw new Error('user is empty.');
    } else {
        data.forEach(doc => {
            const user = new User(
                doc.data().id,
                doc.data().username,
                doc.data().display_name,
                doc.data().phone,
                doc.data().email,
                doc.data().profilePicture,
                doc.data().updatedAt,
                doc.data().createdAt,
                doc.data().friends,


            );
            usersArrays.push(user);
        });

        return usersArrays
    }
};
const getUserData = async (collectionName, fieldName, value) => {
    const query = db.collection(collectionName).where(fieldName, '==', value);

    try {
        const querySnapshot = await query.get();
        if (!querySnapshot.empty) {
            const documentData = querySnapshot.docs[0].data();
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
const save = async (data) => {

    // Kiểm tra xem data có dữ liệu không
    const userData = JSON.parse(data);
    if (!userData) {
        throw new Error('User data is empty.');
    }
    console.log(userData)
    console.log(userData.id)
    const profilePicture = userData.profilePicture ? userData.profilePicture : 'https://lh3.googleusercontent.com/a/ACg8ocK1LMjQE59_kT4mNFmgxs6CmqzZ24lqR2bJ4jHjgB6yiW4=s96-c';
    // Thêm dữ liệu vào Firestore nếu số điện thoại chưa tồn tại
    console.log(profilePicture)
    await db.collection('Users').doc(userData.id).set({
        id: userData.id,
        email: userData.email,
        profilePicture: profilePicture,
        display_name: userData.displayName,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        username: userData.username,
        phone:generateRandomNumberString(10),
        friends:[]
    });

    return 'Record saved successfully';
};

const findByEmail = async (email) => {
    const userData = await getUserData('Users', 'email', email);

    if (userData) {
        return userData;
    } else {
        return null;
    }
};
const findById = async (id) => {
    const userData = await getUserData('Users', 'id', id);

    if (userData) {
        return userData;
    } else {
        return null;
    }
};

const addFriend = async (id,data) => {
    console.log(data)
    // add receive requset
    await db.collection('Users')
        .doc(id)
        .update({
            friends: admin.firestore.FieldValue.arrayUnion({
                id: data.id,
                displayName: data.display_name,
                profilePicture: data.profilePicture,
            })
        });
    // add sender request
    await db.collection('Users')
        .doc(data.id)
        .update({
            friends: admin.firestore.FieldValue.arrayUnion({
                id: id,
                displayName: data.user.display_name,
                profilePicture: "https://lh3.googleusercontent.com/a/ACg8ocK1LMjQE59_kT4mNFmgxs6CmqzZ24lqR2bJ4jHjgB6yiW4=s96-c",
            })
        });
    const privateChatData = {
            chatId: data.id,
            name: data.display_name,
            participants: [id, data.id],
            type: "private",
            deleteId: null,
            messages:[]
    }
    await saveInChat(privateChatData)
    return privateChatData
};


module.exports = {save, findAll, findByEmail,addFriend,findById}