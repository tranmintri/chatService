const express = require('express');
const {
    getListSenderRequestController,
    getListReceiverController,
    checkSendRequestController,
    requestAddFriendController,
    cancelSendedFriendController,
    acceptFriendController,
    declineFriendController,
    getListReceiverRequestController,
    deleteFriendRequestController
} = require('../controllers/friendRequestController');

const router = express.Router();

router.get('/requests/getListSenderRequest/:senderId', getListSenderRequestController); // senderId route param ok
router.get('/requests/getListReceiverRequest/:receiverId', getListReceiverRequestController); // receiverId route param ok
router.get('/requests/check', checkSendRequestController); // senderId, receiverId ok
router.post('/requests/add', requestAddFriendController); // senderId, receiverId  ok
router.post('/requests/cancel', cancelSendedFriendController); // userId, requestId ok
router.post('/requests/accept', acceptFriendController); // userId, requestId ok
router.post('/requests/decline', declineFriendController); // userId, requestId ok
router.post('/requests/delete', deleteFriendRequestController); // userId ok

module.exports = {
    routes: router
}