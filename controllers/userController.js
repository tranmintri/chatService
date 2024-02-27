'use strict';
const admin = require("firebase-admin")
const {db} = require('../config/firebase')

const addUserWithFriend = async (req, res, next) => {
    try {
        const data = req.body;

        // Kiểm tra xem newConversation.messages có dữ liệu hay không
        if (!data) {
            throw new Error('user data are required.');
        }
        // Thêm dữ liệu vào Firestore nếu có dữ liệu messages
        await db.collection('Users').doc(data.userId).set({
            userId: data.userId
        })
            .then((docRef) => {
                res.send('Record saved successfully');
            })
            .catch((error) => {
                console.error('Error adding document:', error);
                res.status(500).send('Internal Server Error');
            });
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const getFriendList = async (req, res, next) => {
    const {userId} = req.params;
    try {
        const userData = await getUserData('Users', userId);
        const friendArray = [];
        if (userData.friends == null)
            res.status(404).send('No friends in user');
        else {
            userData.friends.forEach(doc => {
                friendArray.push(doc);
            });
            res.send(friendArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const addFriend = async (req, res, next) => {
    try {
        const {userId} = req.params;
        const {friendId} = req.params;
        await db.collection('Users')
            .doc(userId)
            .update({
                friends: admin.firestore.FieldValue.arrayUnion({
                    friendId
                })
            });
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const removeFriendById = async (req, res, next) => {
    const {userId,friendId} = req.params;

    try {
        const userData = await getUserData('Users', userId);
        if (!userId || !friendId) {
            return res.status(400).json({ error: 'Invalid request. chatId and messageId are required.' });
        }
        if (userData.friends == null){
            return res.status(400).json({ error: 'no any friend in user' });
        }
        else {
            const friends = userData.friends || [];
            const updatedFriends = friends.filter(friend => friend != friendId);
            await db.collection('Users').doc(userId).update({ messages: updatedFriends });
            res.status(200).json({ success: true, message: 'friend deleted successfully.' });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const findFriend = async (req, res, next) => {
    const userID = req.params.userID;
    const keyword = req.query.keyword;
    try {
        const userData = await getUserData('Users', userID);

        if (!userData.friends || userData.friends.length === 0) {
            res.status(404).send('No friend in user');
        } else {
            const matchingFriends = userData.friends.filter(friend => friend.includes(keyword));
            res.send(matchingFriends);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getUserData = async (collectionName, userId) => {
    const documentRef = db.collection(collectionName).doc(userId);

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

module.exports = {addUserWithFriend,findFriend,getFriendList,addFriend,removeFriendById}