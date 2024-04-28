'use strict';
const {getListSenderRequest, getListReceiverRequest, checkSendRequest, requestAddFriend, cancelSendedFriend, acceptFriend, declineFriend, deleteFriendRequest} = require("../service/friendRequestService");
const {v4: uuidv4} = require("uuid");

const getListSenderRequestController = async (req, res) => {
    try {
        const senderId = req.params.senderId;
        const friendRequests = await getListSenderRequest(senderId);
        res.status(200).json(friendRequests);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getListReceiverRequestController = async (req, res) => {
    try {
        const receiverId = req.params.receiverId;
        const friendRequests = await getListReceiverRequest(receiverId);
        res.status(200).json(friendRequests);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const checkSendRequestController = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        const result = await checkSendRequest(senderId, receiverId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const requestAddFriendController = async (req, res) => {
    try {
        const { isAccepted, receiver, sender, profilePicture, senderName, receiverName, requestId   } = req.body;
        const result = await requestAddFriend(isAccepted, receiver, sender, profilePicture, senderName, receiverName, requestId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const cancelSendedFriendController = async (req, res) => {
    try {
        const { userId, requestId } = req.body;
        const result = await cancelSendedFriend(userId, requestId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const acceptFriendController = async (req, res) => {
    try {
        const data = req.body
        const result = await acceptFriend(data);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const declineFriendController = async (req, res) => {
    try {
        const { userId, requestId } = req.body;
        const result = await declineFriend(userId, requestId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
const deleteFriendRequestController = async (req, res, next) => {
    const data  = req.body;
    console.log("data in rq")
    console.log(data)
    try{
        // const {id, user} = req.body;
        const result = await deleteFriendRequest(data);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
module.exports = {
    getListSenderRequestController,
    getListReceiverRequestController,
    checkSendRequestController,
    requestAddFriendController,
    cancelSendedFriendController,
    acceptFriendController,
    declineFriendController,
    deleteFriendRequestController
};