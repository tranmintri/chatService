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

let browserInstance;
const openNewBrowser = async (chatId) => {

    let browser;
    try {
        // Khởi tạo trình duyệt mới
    // || !await browserInstance.isConnected()
        if (!browser ) {
            // Khởi tạo trình duyệt mới
            browser = await puppeteer.launch({
                headless: false, // false để hiển thị giao diện người dùng
            });
        }

        // Mở một trang mới trong trình duyệt
        const page = await browser.newPage();
        const pages = await browser.pages();
        if (pages.length > 1) {
            await pages[0].close();
        }
        // Điều hướng đến URL mong muốn

        // Lấy kích thước của màn hình
        const screenSize = await page.evaluate(() => {
            return {
                width: window.screen.width,
                height: window.screen.height
            };
        });
        console.log({ width: screenSize.width, height: screenSize.height });

        // Đặt kích thước của cửa sổ trình duyệt sao cho nó bằng kích thước của màn hình
        await page.setViewport({ width: screenSize.width, height: screenSize.height });
        await page.goto(`http://localhost:3000/chat/${chatId}`);
    } catch (error) {
        console.error('Error occurred while opening new browser:', error);
    } finally {
        // Đảm bảo đóng trình duyệt một cách an toàn
        if (browser) {
            try {
                // await browser.close();
                // console.log('Browser closed successfully.');
            } catch (closeError) {
                console.error('Error occurred while closing browser:', closeError);
            }
        }
    }
};

const server = app.listen(PORT, () => {
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
        console.log(Array.from(onlineUsers.keys()))
    })

    socket.on("get-online-user", () => {
        socket.emit("online-users", Array.from(onlineUsers.keys()));
    })

    socket.on("get-browser", (chatId) => {
        openNewBrowser(chatId); // Gọi hàm mở trình duyệt mới
    });

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
                senderName: data.newMessage.senderName,
                senderPicture:data.newMessage.senderPicture,
                type: data.newMessage.type,
                content: data.newMessage.content,
                timestamp: data.newMessage.timestamp
            }
        })

        socket.on("disconnect", () => {
            console.log("A user disconnected");
            // Loại bỏ người dùng khỏi danh sách người dùng đang trực tuyến
            onlineUsers.forEach((value, key) => {
                if (value === socket.id) {
                    onlineUsers.delete(key);
                }
            });
        });

        socket.on('join-call', (roomId) => {
            socket.join(roomId);
        });

        // Listen for offer event
        socket.on('offer', (data) => {
            console.log(data)
            io.to(data.roomId).emit('offer', data.offer);
        });

        // Listen for answer event
        socket.on('answer', (data) => {
            console.log(data)
            io.to(data.roomId).emit('answer', data.answer);
        });

        // Listen for ICE candidates event
        socket.on('ice-candidate', (data) => {
            console.log(data)
            io.to(data.roomId).emit('ice-candidate', data.candidate);
        });

    });
})
// chatEvent(io);
// callEvent(io)