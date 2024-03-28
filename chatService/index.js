'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const chatRoutes = require('./routes/chat-routes');
const messageRoutes = require('./routes/message-routes')
const userRoutes = require('./routes/user-routes')
const chatEvent = require('./socketIO/chatEvent');
const callEvent = require('./socketIO/callEvent');

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


const PORT = process.env.PORT || 8081;


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/api', chatRoutes.routes);
app.use('/api/chats', messageRoutes.routes);
app.use('/api', userRoutes.routes);
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

    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        console.log("add-user")
        console.log(userId)
        onlineUsers.set(userId, socket.id)
    })

    socket.on("send-msg", (data) => {
        console.log("send-msg")
        console.log(data)
        console.log(data.receiveId)
        const sendUserSocket = onlineUsers.get(data.receiveId)
        console.log(onlineUsers.get(data.receiveId))
        console.log(onlineUsers.get(data.receiveId))
        // if (sendUserSocket){
        socket.to(sendUserSocket).emit("msg-recieve", {
            from: data.newMessage.senderId,
            newMessage:{
                senderId: data.newMessage.senderId,
                type: data.newMessage.type,
                content: data.newMessage.content,
                timestamp: data.newMessage.timestamp
            }
        })
        // }
    });
})
// chatEvent(io);
// callEvent(io)