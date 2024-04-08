
const express = require('express');
const {
    addUser, getUserByEmail,getAllUser,addFriendToList,getUserById,updateUserCon
} = require('../controllers/userController');

const router = express.Router();


//add user
router.post('/users', addUser);
router.put('/users', updateUserCon);
router.get('/users', getAllUser);
router.post('/users/email', getUserByEmail);
router.post("/users/:id",addFriendToList);
router.get("/users/:id",getUserById);
module.exports = {
    routes: router
}