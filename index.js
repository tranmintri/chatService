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

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        methods: ["GET", "POST"],
        origin: "http://localhost:3000",
    },
});

app.use(function(req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    next();
});
chatEvent(io);
callEvent(io)

const dotenv = require("dotenv")

dotenv.config()

const PORT = process.env.PORT || 8081;


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/api', chatRoutes.routes);
app.use('/api/chats', messageRoutes.routes);
app.use('/api/users', messageRoutes.routes);
server.listen(PORT,()=>{
    console.log(`App is listening on ${PORT}`)
})