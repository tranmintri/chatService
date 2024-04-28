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
const requestAddFriend = async (isAccepted, receiver, sender, profilePicture, senderName, receiverName, requestId) => {
    try {
        const userRef = db.collection('Users').doc(sender);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new Error("ng dung k ton tai");
        }
        const userData = userDoc.data();
        if (sender == receiver) {
            throw new Error("bn k the gui loi moi kb cho chinh minh");
        }
        if (userData.friends && userData.friends.includes(receiver)) {
            throw new Error("add fen roi");
        }
        const friendRequestSnapshot = await db.collection('FriendRequests')
            .where('sender', '==', sender)
            .where('receiver', '==', receiver)
            .get();

        if (!friendRequestSnapshot.empty) {
            return { message: "Yêu cầu kết bạn đã được gửi" };
        }
        const newFriendRequest = {
            senderName: senderName,
            receiverName: receiverName,
            requestId: uuidv4(),
            isAccepted: false,
            sender: sender,
            receiver: receiver,
            profilePicture: profilePicture
        };
        await db.collection('FriendRequests').doc(newFriendRequest.requestId).set(newFriendRequest);
        // return { message: "Yêu cầu kết bạn đã được gửi" };
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Internal Server Error');
    }
};
// huy YC KB
const cancelSendedFriend = async (userId, requestId) => {
    try {
        const userRef = db.collection('Users').doc(userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new Error("Người dùng chưa đăng nhập!!!");
        }
        const requestsSnapshot = await db.collection('FriendRequests')
            .where('sender', '==', userId)
            .where('receiver', '==', requestId)
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
    console.log(data)
    try {
        const userRef = db.collection('Users').doc(data.receiver.id);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new Error("Người dùng chưa đăng nhập!!!");
        }
        const user = userDoc.data();

        const senderRef = db.collection('Users').doc(data.senderId);
        const senderDoc = await senderRef.get();
        if (!senderDoc.exists) {
            throw new Error("Người gửi không tồn tại");
        }
        const sender = senderDoc.data();

        // Check if the sender is already a friend
        if (user.friends && user.friends.includes(data.senderId)) {
            throw new Error("đã có trong danh sách bạn bè của bạn");
        }
        if (!Array.isArray(sender.friends)) {
            sender.friends = [];
        }
        const senderFriend = {
            id: data.receiver.id,
            displayName: data.receiver.display_name,
            profilePicture: data.receiver.avatar
        }
        sender.friends = [...sender.friends, senderFriend];
        await senderRef.update(sender);

        if (!Array.isArray(user.friends)) {
            user.friends = [];
        }
        const receiverFriend = {
            id: data.senderId,
            displayName: data.senderName,
            profilePicture: data.profilePicture
        }
        user.friends = [...user.friends, receiverFriend];
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
        const snapshot = await friendRequestsRef.where('sender', '==', data.senderId).where('receiver', '==', data.receiver.id).get();
        
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
const declineFriend = async (userId, requestId) => {
    try {
        const userRef = db.collection('Users').doc(userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new Error("Người dùng chưa đăng nhập!!!");
        }
        const friendRequestsRef = db.collection('FriendRequests');
        const snapshot = await friendRequestsRef.where('sender', '==', requestId).where('receiver', '==', userId).get();
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
}
const deleteFriendRequest = async (data) => {
    console.log(data,'data')
    const friendRequestsRef = db.collection('FriendRequests');
    const snapshot = await friendRequestsRef.where('sender', '==', data.sender).where('receiver', '==', data.receiver).get();
    
    if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    }  
    
    snapshot.forEach(doc => {
      doc.ref.delete();
    });
}
module.exports = {
    getListSenderRequest,
    getListReceiverRequest,
    checkSendRequest,
    requestAddFriend,
    cancelSendedFriend,
    acceptFriend,
    declineFriend,
    deleteFriendRequest
}