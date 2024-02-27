
const express = require('express');
const {addUserWithFriend,findFriend,
    getFriendList,addFriend,removeFriendById

} = require('../controllers/userController');

const router = express.Router();

//get friend list
router.get('/:userId/friends', getFriendList);
//add friend in user
router.post('/:userId/friends/:friendId', addFriend);
//add user no friend
router.post('', addUserWithFriend);
//remove friend by id in user
router.delete('/:userId/friends/:friendId', removeFriendById);
//search friend in user
router.get('/:userId/friends/search', findFriend);
module.exports = {
    routes: router
}