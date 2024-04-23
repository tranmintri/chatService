'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const chatRoutes = require('./routes/chat-routes');
const messageRoutes = require('./routes/message-routes')
const userRoutes = require('./routes/user-routes')
const puppeteer = require('puppeteer');
const userService = require('./service/userService')
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


    socket.on("request-to-voice-call-private", (data) => {
        io.to(onlineUsers.get(data.receiveId)).emit("response-to-voice-call-private", data)
    })
    socket.on("request-accept-voice-call", (incomingVoiceCall, callAccepted) => {
        io.to(onlineUsers.get(incomingVoiceCall.senderId)).emit("response-accept-call-private", callAccepted)
    })
    socket.on("request-cancel-voice-call", (data) => {
        io.to(onlineUsers.get(data.senderId)).emit("response-cancel-call-private", data)
    })
    socket.on("request-end-voice-call", (data) => {
        io.to(onlineUsers.get(data.receiveId)).emit("response-end-call-private", data)
    })
    socket.on("request-disband-the-group", (data) => {
        const {currentChat, userInfo} = data;
        const receivers = currentChat.participants.filter(p => p !== userInfo.id);

        console.log("disband");
        console.log(receivers);
        console.log(data);

        receivers.forEach((receiverId) => {
            const receiverSocket = onlineUsers.get(receiverId);
            console.log(receiverSocket);
            if (receiverSocket) {
                socket.to(receiverSocket).emit("response-disband-the-group", currentChat.chatId);
            } else {
                console.log(`User ${receiverId} is not online.`);
            }
        });
    });
    socket.on("request-create-the-group", (data) => {
        console.log("create group")
        console.log(data)
        const {newChat, userInfo} = data;
        const receivers = newChat.participants.filter(p => p !== userInfo.id)

        receivers.forEach((receiverId) => {
            const receiverSocket = onlineUsers.get(receiverId);

            if (receiverSocket) {
                console.log("socketId " + receiverSocket);
                socket.to(receiverSocket).emit("response-create-the-group", newChat);
            } else {
                console.log(`User ${receiverId} is not online.`);
            }
        });
    });
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
    socket.on("request-get-all-friend-online", (data) => {
        console.log("all-friend-online")
        console.log(data)
        const onlineFriends = [];
        // Kiểm tra xem trường "friends" có tồn tại và không phải là mảng trống
        if (data.friends && data.friends.length > 0) {
            // Lặp qua danh sách bạn bè của người dùng
            data.friends.forEach((friend) => {
                if (onlineUsers.has(friend.id)) {
                    onlineFriends.push(friend.id);
                }
            });
        }
        io.to(onlineUsers.get(data.id)).emit("response-get-all-friend-online", onlineFriends);
    });


    socket.on("request-connect-user",(data)=>{
            console.log("connect-user")
            console.log(data)
        // Kiểm tra xem trường "friends" có tồn tại và không phải là mảng trống
        if (data.friends && data.friends.length > 0) {
            // Lặp qua danh sách bạn bè của người dùng
            data.friends.forEach((friend) => {
                const friendSocket = onlineUsers.get(friend.id)
                socket.to(friendSocket).emit("response-connect-user",data.id)
            });
        }
    })

    // Gửi danh sách người dùng trực tuyến khi một người dùng ngắt kết nối
    socket.on("disconnect", () => {
        const disconnectedUserId = [...onlineUsers.entries()]
            .find(([key, value]) => value === socket.id)?.[0];

        if (disconnectedUserId) {
            const currentOnline = []

            io.emit("disconnect-user",disconnectedUserId)
        }
    });

    socket.on('join-to-chat-public', (roomId) => {
        socket.join(roomId);
    });

    socket.on("leave-group", (data) => {
        userService.leaveGroup(data)
        const postData = {
            chatId: data.chatId,
            chatParticipants: data.chatParticipants,
            userId: data.userId,
            user_Name: data.user_Name,
            managerId: data.managerId,
        };
        // console.log(data.chatParticipants)
        // data.chatParticipants.forEach(participant => {
        //     if (onlineUsers.has(participant)) {
        socket.to(onlineUsers.get(data.userId)).emit("leave-group-noti", postData);
        // }    e
        // });
    });

    socket.on("kick-from-group", (data) => {
        userService.leaveGroup(data)
        const postData = {
            chatId: data.chatId,
            chatParticipants: data.chatParticipants,
            userId: data.userId,
            user_Name: data.user_Name,
            managerId: data.managerId,
        };
        console.log(data.chatParticipants)
        data.chatParticipants.forEach(participant => {
            if (onlineUsers.has(participant)) {
                socket.to(onlineUsers.get(participant)).emit("kick-out", postData);
            }
        });
    });
})