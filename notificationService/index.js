'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const friendRequestRoutes = require('./routes/friendRequest-routes')
const friendRequestService = require('./service/friendRequestService')
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const { log } = require('console');

dotenv.config()
app.use(cors());

app.use(function(req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    next();
});


const PORT = process.env.PORT;

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// app.use('/api', userRoutes.routes);
app.use('/api', friendRequestRoutes.routes);
const server = app.listen(PORT,()=>{
    console.log(`App is listening on ${PORT}`)
})
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    },
});
// global.onlineUsers = new Map();
// io.on("connection", (socket) => {
//     global.notiSocket = socket;

//     socket.on("add-user", (userId) => {
//         console.log("add-user")
//         console.log(userId)
//         onlineUsers.set(userId, socket.id)
//     })

//     socket.on("friend-request-accept-status", (data) => {
//         const userID = onlineUsers.get(data.userId);
//         if (userID) {
//             const chat = { chatId: foundUser.chatId, name: foundUser.name + ' & ' + sender.name, participants: [foundUser.userId, sender.userId], type: 'private' };
//             socket.to(userID).emit("friend-request-accept-status", { foundUser, chat, sender });
//             socket.emit("accept-by-me", { data });
//         }
//     });

//     socket.on("friend-request-decline-status", (data) => {
//         const userID = onlineUsers.get(data.userId);
//         if (userID) {
//             socket.to(userID).emit("friend-request-decline-status", data);
//         }
//     });

// })
global.onlineUsers = new Map();
io.on("connection", (socket) => {

    global.notifSocket = socket;
    socket.on("add-user", (userId) => {
        console.log("add-user")
        console.log(userId)
        onlineUsers.set(userId, socket.id)
    })
    
    socket.on("sendFriendRequest", (data) => {
        friendRequestService.requestAddFriend(data)
        const postData = {
            id: data.id_UserWantAdd,
            display_name: data.receiverName,
            profilePicture: data.profilePicture
        };
        socket.to(onlineUsers.get(data.id_UserWantAdd)).emit("friendRequest", postData);
        console.log("Friend request sent:", data);
    });

    socket.on("acceptFriendRequest", (data) => {
        console.log(data, "acceptFriendRequest")
        friendRequestService.acceptFriend(data)
        const postData = {
            userId: data?.userId,
            requestId: data?.requestId
        };
        console.log(postData, "postData")
        socket.to(onlineUsers.get(data.userId)).emit("accept", postData);
    });


    // socket.on("rejectFriendRequest", (data) => {
    //     friendRequestService.rejectFriendRequest(data)
    //     const postData = {
    //         id: data.id_UserWantAdd,
    //         display_name: data.receiverName,
    //         profilePicture: data.profilePicture
    //     };
    //     socket.to(onlineUsers.get(data.id_UserWantAdd)).emit("rejectFriendRequest", postData);
    //     console.log("Friend request rejected:", data);
    // });

    // socket.on("cancelFriendRequest", (data) => {
    //     friendRequestService.cancelFriendRequest(data)
    //     const postData = {
    //         id: data.id_UserWantAdd,
    //         display_name: data.receiverName,
    //         profilePicture: data.profilePicture
    //     };
    //     socket.to(onlineUsers.get(data.id_UserWantAdd)).emit("cancelFriendRequest", postData);
    //     console.log("Friend request cancelled:", data);
    // })

})