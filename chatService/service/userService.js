const {v4: uuidv4} = require('uuid');
const {user} = require('../models/user')
const admin = require("firebase-admin")
const {db} = require('../config/firebase')
const {User} = require("../models/user");
const {Kafka} = require('kafkajs');
const {save: saveInChat} = require("./chatService")

const kafka = new Kafka({
    clientId: 'user-consumer',
    brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({groupId: 'user-group'});

const run = async () => {
    await consumer.connect();
    await consumer.subscribe({topic: 'newuser', fromBeginning: false}); // Set fromBeginning to false to only receive new messages

    await consumer.run({
        eachMessage: async ({topic, partition, message}) => {
            console.log({
                topic,
                partition,
                offset: message.offset,
                value: message.value.toString(),
            });

            const userData = JSON.parse(message.value.toString());
            console.log("Received new message from Kafka:");
            console.log(userData);

            const userInfo = new User(
                userData.id,
                userData.username != null ? userData.username : userData.email,
                userData.displayName,
                "",
                userData.email,
                "https://www.signivis.com/img/custom/avatars/member-avatar-01.png",
                userData.updatedAt,
                userData.createdAt,
                []
            );
            console.log("Processing new message:");
            console.log(userInfo);

            // Save the user information
            await save(userInfo);

            // Commit the offset to mark the message as processed
            await consumer.commitOffsets([{topic, partition, offset: message.offset}]);
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
        // throw new Error('user is empty.');
        return
    } else {
        data.forEach(doc => {
            const user = new User(
                doc.data().id,
                doc.data().username,
                doc.data().display_name,
                doc.data().phone,
                doc.data().email,
                doc.data().profilePicture,
                doc.data().updated_at,
                doc.data().created_at,
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

    if (!data) {
        throw new Error('User data is empty.');
    }
    console.log("save")
    console.log(data)
    console.log(data.id)
    const profilePicture = data.profilePicture ? data.profilePicture : 'https://www.signivis.com/img/custom/avatars/member-avatar-01.png';
    // Thêm dữ liệu vào Firestore nếu số điện thoại chưa tồn tại
    console.log(profilePicture)
    await db.collection('Users').doc(data.id).set({
        id: data.id,
        email: data.email,
        profilePicture: profilePicture,
        display_name: data.display_name,
        created_at: data.created_at,
        updated_at: data.updated_at,
        username: data.username,
        phone: data.phone,
        friends: []
    });

    return 'Record saved successfully';
};
const updateUser = async (data) => {
    // Kiểm tra xem data có dữ liệu không
    if (!data) {
        throw new Error('User data is empty.');
    }

    // Cập nhật thông tin người dùng trong Firestore
    await db.collection('Users').doc(data.id).update({
        email: data.email,
        display_name: data.display_name,
        updated_at: data.updated_at,
        profilePicture: data.avatar,
        username: data.username,
        phone: data.phone,


        // Bạn có thể cập nhật các trường khác tương tự như username, friends, ...
    });

    return 'User updated successfully';
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

const addFriend = async (data) => {
    console.log("addFriend")
    console.log(data)
    // add receive requset
    await db.collection('Users')
        .doc(data.senderId)
        .update({
            friends: admin.firestore.FieldValue.arrayUnion({
                id: data.receiver.id,
                displayName: data.receiver.display_name,
                profilePicture: data.receiver.avatar
            })
        });
    // add sender request
    await db.collection('Users')
        .doc(data.receiver.id)
        .update({
            friends: admin.firestore.FieldValue.arrayUnion({
                id: data.senderId,
                displayName: data.senderName,
                profilePicture: data.profilePicture,
            })
        });
    const chatId = uuidv4()
    const messageId = uuidv4()
    console.log("add friend")
    console.log(data)
    const privateChatData = {
        chatId: chatId,
        name: data.receiver.display_name + "/" + data.senderName,
        picture: data.receiver.avatar + "|" + data.profilePicture,
        participants: [data.senderId, data.receiver.id],
        type: "private",
        deleteId: null,
        messages: [
            {
                senderId: data.senderId,
                senderName: data.receiver.display_name + "/" + data.senderName,
                messageId:messageId,
                senderPicture: data.receiver.avatar + "|" + data.profilePicture,
                type: "init friend",
                content: "",
                timestamp: Date.now(),
                status: "sent"
            }
        ],
        managerId: null
    }
    await saveInChat(privateChatData)
    return privateChatData
};

const removeFriend = async (id, data) => {
    try {
        const userRef = db.collection('Users').doc(id);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            throw new Error('User not found');
        }
        const userFriends = userDoc.data().friends;
        const updatedUserFriends = userFriends.filter(friend => friend.id !== data.data.id);
        await userRef.update({
            friends: updatedUserFriends
        });
        const friendRef = db.collection('Users').doc(data.data.id);
        const friendDoc = await friendRef.get();

        if (!friendDoc.exists) {
            throw new Error('Friend not found');
        }
        const friendFriends = friendDoc.data().friends;
        const updatedFriendFriends = friendFriends.filter(friend => friend.id !== id);
        await friendRef.update({
            friends: updatedFriendFriends
        });
        const chatRef = db.collection('Chats');
        const chatSnapshot = await chatRef.get();
        chatSnapshot.forEach(doc => {
            const chatData = doc.data();
            if (chatData.participants.includes(id) && chatData.participants.includes(data.data.id) && chatData.participants.length === 2) {
                doc.ref.delete();
            }
        });

        console.log('Friend removed successfully');
    } catch (error) {
        console.error('Error removing friend:', error);
    }
};

const leaveGroup = async (data) => {
    try {
        const groupRef = db.collection('Chats').doc(data.chatId);
        const groupSnapshot = await groupRef.get();

        if (!groupSnapshot.exists) {
            console.error('Group does not exist');
            return;
        }
        const groupData = groupSnapshot.data();
        const updatedParticipants = groupData.participants.filter(participant => participant !== data.userId);
        if (groupData.participants.length === updatedParticipants.length) {
            console.error('User is not a member of the group');
            return;
        }

        await groupRef.update({participants: updatedParticipants});
        console.log('User left group successfullyy');
    } catch (error) {
        console.error('Error leaving group:', error);
    }
};


module.exports = {save, findAll, findByEmail, addFriend, findById, updateUser, removeFriend, leaveGroup,getUserData}