'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const friendRequestRoutes = require('./routes/friendRequest-routes')
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv")

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
global.onlineUsers = new Map();
io.on("connection", (socket) => {
    global.notiSocket = socket;

    socket.on("add-user", (userId) => {
        console.log("add-user")
        console.log(userId)
        onlineUsers.set(userId, socket.id)
    })
    socket.on("send-msg-private", (data) => {
        console.log("send-msg")
        console.log(data)
        console.log(data.receiveId)
        const sendUserSocket = onlineUsers.get(data.receiveId)
        // if (sendUserSocket){
        socket.to(sendUserSocket).emit("msg-recieve-private", {
            from: data.newMessage.senderId,
            newMessage: {
                senderId: data.newMessage.senderId,
                type: data.newMessage.type,
                content: data.newMessage.content,
                timestamp: data.newMessage.timestamp
            }
        })
        // }
    });
    socket.on("friend-request-status", (data) => {
        const receiverSocketId = onlineUsers.get(data.id_UserWantAdd);
        if (receiverSocketId) {
            console.log("ng dc gui co online");
            socket.to(receiverSocketId).emit("friend-request-status", data.userId);
        }
    });
    socket.on("my-request-to-friend", (data) => {
        const senderSocketId = onlineUsers.get(data.userId);
        if (senderSocketId) {
            console.log("ng gui co online");
            socket.to(senderSocketId).emit("my-request-to-friend", data);
        }
    });

    socket.on("cancel-friend-request", (data) => {
        const userId = onlineUsers.get(data.userId);
        if(userId){
            socket.to(userId).emit("cancel-friend-request", data.userId);
        }
    });


    // socket.on("friend-request-accept-status", (data) => {
    //     const userID = onlineUsers.get(data.userId);
    //     if (userID) {
    //         const chat = { chatId: foundUser.chatId, name: foundUser.name + ' & ' + sender.name, participants: [foundUser.userId, sender.userId], type: 'private' };
    //         socket.to(userID).emit("friend-request-accept-status", { foundUser, chat, sender });
    //         socket.emit("accept-by-me", { data });
    //     }
    // });

    socket.on("friend-request-decline-status", (data) => {
        const userID = onlineUsers.get(data.userId);
        if (userID) {
            socket.to(userID).emit("friend-request-decline-status", data);
        }
    });

})
