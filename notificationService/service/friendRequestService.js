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
            throw new Error("No friend requests found");
        }
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Internal Server Error');
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
            throw new Error("No friend requests found");
        }
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Internal Server Error');
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
const requestAddFriend = async (userId, id_UserWantAdd) => {
    try {
        const userRef = db.collection('Users').doc(userId);
        console.log(userRef)
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new Error("ng dung k ton tai");
        }
        const userData = userDoc.data();
        if (userId == id_UserWantAdd) {
            throw new Error("bn k the gui loi moi kb cho chinh minh");
        }
        if (userData.friends && userData.friends.includes(id_UserWantAdd)) {
            throw new Error("add fen roi");
        }
        const friendRequestSnapshot = await db.collection('FriendRequests')
            .where('sender', '==', userId)
            .where('receiver', '==', id_UserWantAdd)
            .get();

        if (!friendRequestSnapshot.empty) {
            throw new Error("Yêu cầu kết bạn đã được gửi");
        }
        const newFriendRequest = {
            requestId: uuidv4(),
            isAccepted: false,
            sender: userId,
            receiver: id_UserWantAdd,
        };
        await db.collection('FriendRequests').doc(newFriendRequest.requestId).set(newFriendRequest);

        return { message: "Yêu cầu kết bạn đã được gửi" };
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
        const requestRef = db.collection('FriendRequests').doc(requestId);
        const requestDoc = await requestRef.get();
        if (!requestDoc.exists) {
            throw new Error("Yêu cầu đã bị hủy hoặc chưa được gửi");
        }
        await db.collection('FriendRequests').doc(requestId).delete();
        return { message: "Yêu cầu kết bạn đã bị hủy" };
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Internal Server Error');
    }
};
// chap nhan YC KB
const acceptFriend = async (userId, requestId) => {
    try {
        const userRef = db.collection('Users').doc(userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new Error("Người dùng chưa đăng nhập!!!");
        }
        const requestRef = db.collection('FriendRequests').doc(requestId);
        const requestDoc = await requestRef.get();

        if (!requestDoc.exists) {
            throw new Error("Yêu cầu đã được chấp nhận hoặc chưa được gửi");
        }
        const request = requestDoc.data();
        if (userId === request.sender) {
            throw new Error("Bản thân không thể tự chấp nhận lời mời kết bạn");
        }
        if (userId !== request.receiver) {
            throw new Error("Người đang đăng nhập không phải người được gửi");
        }
        const senderRef = db.collection('Users').doc(request.sender);
        const senderDoc = await senderRef.get();
        if (!senderDoc.exists) {
            throw new Error("Người gửi không tồn tại");
        }
        const sender = senderDoc.data();
        if (sender.friends && sender.friends.includes(userId)) {
            throw new Error("đã có trong danh sách bạn bè của bạn");
        }
        sender.friends = [...sender.friends, userId];
        await senderRef.update(sender);

        const user = userDoc.data();

        if (user.friends && user.friends.includes(request.sender)) {
            throw new Error("đã kết bạn rồi");
        }
        user.friends = [...user.friends, request.sender];
        await userRef.update(user);
        await db.collection('FriendRequests').doc(requestId).delete();
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
        const requestRef = db.collection('FriendRequests').doc(requestId);
        const requestDoc = await requestRef.get();
        if (!requestDoc.exists) {
            throw new Error("Yêu cầu đã bị từ chối hoặc chưa được gửi");
        }
        const request = requestDoc.data();
        if (userId !== request.sender && userId !== request.receiver) {
            throw new Error("Không thể xóa lời mời kết bạn của người khác");
        }
        await db.collection('FriendRequests').doc(requestId).delete();
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