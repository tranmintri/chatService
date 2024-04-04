const { v4: uuidv4 } = require('uuid');
const { Request } = require('../models/friendRequest');
const admin = require("firebase-admin")
const {db} = require('../config/firebase')

// lay ds yeu cau KB gui di
const getListSenderRequest = async (senderId) => {
    try {
        const querySnapshot = await db.collection('FriendRequests')
            .where('sender', '==', senderId)
            .get();
        if (!querySnapshot.empty) {
            const requests = [];
            querySnapshot.forEach(doc => {
                requests.push(doc.data());
            });
            return requests;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error:', error);
        return { message: 'Internal Server Error' };
    }
}
// lay ds yeu cau KB nhan ve
const getListReceiverRequest = async (receiverId) => {
    try {
        const querySnapshot = await db.collection('FriendRequests')
            .where('receiver', '==', receiverId)
            .get();
        if (!querySnapshot.empty) {
            const requests = [];
            querySnapshot.forEach(doc => {
                requests.push(doc.data());
            });
            return requests;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error:', error);
        return { message: 'Internal Server Error' };
    }
}
// kiem tra da gui yc KB chua
const checkSendRequest = async (senderId, receiverId) => {
    try {
        const userRequestsSnapshot = await db.collection('FriendRequests')
            .where('sender', '==', senderId)
            .where('receiver', '==', receiverId)
            .get();

        if (!userRequestsSnapshot.empty) {
            return { success: true };
        } else {
            return { success: false };
        }
    } catch (err) {
        console.error('Error:', err);
        throw new Error('Internal Server Error');
    }
}
//gui YC
const requestAddFriend = async (data) => {
    console.log(data)
    try {
        const userRef = db.collection('Users').doc(data.userId);
        console.log(userRef)
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new Error("ng dung k ton tai");
        }
        const userData = userDoc.data();
        if (data.userId == data.id_UserWantAdd) {
            throw new Error("bn k the gui loi moi kb cho chinh minh");
        }
        if (userData.friends && userData.friends.includes(data.id_UserWantAdd)) {
            throw new Error("add fen roi");
        }
        const friendRequestSnapshot = await db.collection('FriendRequests')
            .where('sender', '==', data.userId)
            .where('receiver', '==', data.id_UserWantAdd)
            .get();

        if (!friendRequestSnapshot.empty) {
            return { message: "Yêu cầu kết bạn đã được gửi" };
        }
        const newFriendRequest = {
            senderName: data.senderName,
            receiverName: data.receiverName,
            requestId: uuidv4(),
            isAccepted: false,
            sender: data.userId,
            receiver: data.id_UserWantAdd,
        };
        await db.collection('FriendRequests').doc(newFriendRequest.requestId).set(newFriendRequest);
        // return { message: "Yêu cầu kết bạn đã được gửi" };
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Internal Server Error');
    }
};
// huy YC KB
const cancelSendedFriend = async (data) => {
    try {
        const userRef = db.collection('Users').doc(data.userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new Error("Người dùng chưa đăng nhập!!!");
        }
        const requestsSnapshot = await db.collection('FriendRequests')
            .where('sender', '==', data.userId)
            .where('receiver', '==', data.requestId)
            .get();
        if (requestsSnapshot.empty) {
            throw new Error("Yêu cầu đã bị hủy hoặc chưa được gửi");
        }
    
        requestsSnapshot.forEach(doc => {
            doc.ref.delete();
        });
    
        return { message: "Yêu cầu kết bạn đã bị hủy" };
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Internal Server Error');
    }
};
// chap nhan YC KB
const acceptFriend = async (data) => {
    try {
        const userRef = db.collection('Users').doc(data.userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new Error("Người dùng chưa đăng nhập!!!");
        }
        const user = userDoc.data();

        const senderRef = db.collection('Users').doc(data.requestId);
        const senderDoc = await senderRef.get();
        if (!senderDoc.exists) {
            throw new Error("Người gửi không tồn tại");
        }
        const sender = senderDoc.data();

        // Check if the sender is already a friend
        if (user.friends && user.friends.includes(data.requestId)) {
            throw new Error("đã có trong danh sách bạn bè của bạn");
        }
        if (!Array.isArray(sender.friends)) {
            sender.friends = [];
        }
        sender.friends = [...sender.friends, data.userId];
        await senderRef.update(sender);


        if (!Array.isArray(user.friends)) {
            user.friends = [];
        }
        user.friends = [...user.friends, data.requestId];
        await userRef.update(user);

        // Create chat
        // const chatsData = {
        //     chatId: uuidv4(),
        //     deleteId: null,
        //     name: user.name + ' & ' + sender.name,
        //     participants: [data.userId, data.requestId],
        //     type: 'private'
        // };
        // await db.collection('Chats').doc(chatsData.chatId).set(chatsData);

        // Delete friend request
        const friendRequestsRef = db.collection('FriendRequests');
        const snapshot = await friendRequestsRef.where('sender', '==', data.requestId).where('receiver', '==', data.userId).get();
        
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }  
        
        snapshot.forEach(doc => {
          doc.ref.delete();
        });
        // Emit events to sockets here if necessary
        return { message: "Yêu cầu kết bạn được chấp nhận", user: sender };
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Internal Server Error');
    }
};
// tu choi YC KB
const declineFriend = async (data) => {
    try {
        console.log(data, "data")
        const userRef = db.collection('Users').doc(data.userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new Error("Người dùng chưa đăng nhập!!!");
        }
        // const requestRef = db.collection('FriendRequests')
        //     .where('sender', '==', data.requestId)
        //     .where('receiver', '==', data.userId);
        // const requestDoc = await requestRef.get();
        // if (requestDoc.empty) {
        //     throw new Error("Yêu cầu đã bị từ chối hoặc chưa được gửi");
        // }
        const friendRequestsRef = db.collection('FriendRequests');
        const snapshot = await friendRequestsRef.where('sender', '==', data.requestId).where('receiver', '==', data.userId).get();
        if (snapshot.empty) {
            console.log('No matching documents.');
          return;
        }  
        snapshot.forEach(doc => {
          doc.ref.delete();
        });
        return { message: "Yêu cầu kết bạn đã bị từ chối" };
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Internal Server Error');
    }
};
module.exports = {
    getListSenderRequest,
    getListReceiverRequest,
    checkSendRequest,
    requestAddFriend,
    cancelSendedFriend,
    acceptFriend,
    declineFriend
}