'use strict';
const admin = require("firebase-admin")
const {db} = require('../config/firebase')
const {save, findByEmail, findAll,addFriend,findById,updateUser,removeFriend} = require("../service/userService");


const addUser= async (req, res, next) => {
    console.log("a")
    try {
        const data = req.body;
        console.log("a")
        console.log(req.body)

        // Kiểm tra xem newConversation.messages có dữ liệu hay không
        if (!data) {
            throw new Error('user data are required.');
        }
        // Thêm dữ liệu vào Firestore nếu có dữ liệu messages
        const result = await save(data)
        res.json({data:result,status:true});
    } catch (error) {
        res.json(error.message);
    }
}

const updateUserCon= async (req, res, next) => {
    try {
        const data = req.body;

        // Kiểm tra xem newConversation.messages có dữ liệu hay không
        if (!data) {
            throw new Error('user data are required.');
        }
        // Thêm dữ liệu vào Firestore nếu có dữ liệu messages
        const result = await updateUser(data)
        res.json({data:result,status:true});
    } catch (error) {
        res.json(error.message);
    }
}
const getUserByEmail = async (req, res, next) => {
    const { email } = req.body;
    console.log(email)

    // console.log(chatId)
    try {
        const result = await findByEmail(email);
        if (result) {
            res.status(200).json({data:result,status:true});
            console.log(result);
        } else {
            res.json({msg:"user not found",status:false});
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const getUserById = async (req, res, next) => {
    const { id } = req.params;

    // console.log(chatId)
    try {
        const result = await findById(id);
        if (result) {
            res.status(200).json({data:result,status:true});
            console.log(result);
        } else {
            res.json({msg:"user not found",status:false});
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const getAllUser = async (req, res, next) => {
    try {
        const result = await findAll();
        if (result) {
            res.status(200).json({data:result,status:true});
            console.log(result);
        } else {
            res.json({msg:"user not found",status:false});
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const addFriendToList = async (req, res, next) => {
    const id  = req.params.id;
    const data  = req.body;
    console.log(data, 'data')
    try {
        const result = await addFriend(data);
        if (result) {
            res.status(200).json({data:result,messages:"add friend success",status:false});
        } else {
            res.json({msg:"add friend failed",status:false});
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const removeFriendFromList = async (req, res, next) => {
    const id  = req.params.id;
    const data  = req.body;
    try {
        const result = await removeFriend(id, data);
        if (result) {
            res.status(200).json({data:result, messages:"remove friend success", status:true});
        } else {
            res.json({msg:"remove friend failed", status:false});
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {removeFriendFromList, /* other exports */};

module.exports = {addUser,getUserByEmail,getAllUser,addFriendToList,getUserById,updateUserCon, removeFriendFromList}