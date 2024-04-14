'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const chatRoutes = require('./routes/chat-routes');
const messageRoutes = require('./routes/message-routes')
const userRoutes = require('./routes/user-routes')
const puppeteer = require('puppeteer');

const app = express();
const http = require("http");
const {Server} = require("socket.io");
const dotenv = require("dotenv")

dotenv.config()
app.use(cors());

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    next();
});


const PORT = process.env.PORT || 8081;


app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/api', chatRoutes.routes);
app.use('/api/chats', messageRoutes.routes);
app.use('/api', userRoutes.routes);

const server = app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`)
})
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});
global.onlineUsers = new Map();
io.on("connection", (socket) => {

    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        console.log("add-user")
        console.log(userId)
        onlineUsers.set(userId, socket.id)
        console.log(Array.from(onlineUsers.keys()))
    })

    socket.on("get-online-user", () => {
        socket.emit("online-users", Array.from(onlineUsers.keys()));
    })


    socket.on("send-msg-private", (data) => {
        const receiveUserSocket = onlineUsers.get(data.receiveId)

        if (receiveUserSocket) {
            console.log("recieve-msg-private")
            socket.to(receiveUserSocket).emit("msg-recieve-private", {
                from: data.newMessage.senderId,
                newMessage: {
                    messageId: data.newMessage.messageId,
                    senderId: data.newMessage.senderId,
                    senderName: data.newMessage.senderName,
                    senderPicture: data.newMessage.senderPicture,
                    type: data.newMessage.type,
                    content: data.newMessage.content,
                    timestamp: data.newMessage.timestamp
                }
            })
        }
    })

    socket.on('joinRoom', (chatId) => {
        socket.join(chatId);
    });
    socket.on("send-msg-public", (chatId, data) => {
        socket.to(chatId).emit("msg-recieve-public", {
            from: data.newMessage.senderId,
            newMessage: {
                messageId: data.newMessage.messageId,
                senderId: data.newMessage.senderId,
                senderName: data.newMessage.senderName,
                senderPicture: data.newMessage.senderPicture,
                type: data.newMessage.type,
                content: data.newMessage.content,
                timestamp: data.newMessage.timestamp
            }
        })
    }
    )



    socket.on("disconnect", () => {
        console.log("A user disconnected");
        // Loại bỏ người dùng khỏi danh sách người dùng đang trực tuyến
        onlineUsers.forEach((value, key) => {
            if (value === socket.id) {
                onlineUsers.delete(key);
            }
        });
    });

    socket.on('join-to-chat-public', (roomId) => {
        socket.join(roomId);
    });

    
})