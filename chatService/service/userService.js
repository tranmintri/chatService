const {v4: uuidv4} = require('uuid');
const {user} = require('../models/user')
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
            const userData = JSON.parse(message.value);
            const userInfo = new User(
                userData.id,
                userData.email,
                userData.displayName,
                userData.phone !== "" ? userData.phone : "",
                userData.avatar !== "" ? userData.avatar : "https://www.signivis.com/img/custom/avatars/member-avatar-01.png",
                userData.updatedAt,
                userData.createdAt,
                userData.friends.length > 0 ? userData.friends : []
            );

            console.log("run")
            console.log(userInfo)
            save(userInfo)
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
        phone:data.phone,
        friends:[]
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
        username : data.username,
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
                profilePicture: data.user.avatar,
            })
        });
    const privateChatData = {
            chatId: data.id,
            name: data.display_name + "/" +data.user.display_name,
            picture:data.profilePicture + "|" + data.user.profilePicture,
            participants: [id, data.id],
            type: "private",
            deleteId: null,
            messages:[]
    }
    const friendRequestsRef = db.collection('FriendRequests');
    const snapshot = await friendRequestsRef.where('sender', '==', data.id).where('receiver', '==', data.user.id).get();
    
    if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    }  
    
    snapshot.forEach(doc => {
      doc.ref.delete();
    });
    await saveInChat(privateChatData)
    return privateChatData
};


module.exports = {save, findAll, findByEmail,addFriend,findById,updateUser}