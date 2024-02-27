const {uploadImage,getImage,getFile,uploadFile
} = require('../util/fileProcess');
const SocketIOFile = require("socket.io-file");

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log(`User Connected: ${socket.id}`);

        socket.on("join_room", (data) => {
            console.log(data)
            socket.join(data);
        });

        socket.on("send_message", (data) => {
            console.log(data)
            socket.to(data.room).emit("receive_message", data);
        });

        //upload file
        const uploader = new SocketIOFile(socket, {
            uploadDir: 'uploads',
            chunkSize: 10240,
            transmissionDelay: 0,
        });


        uploader.on('start', (fileInfo) => {
            console.log('File upload started:', fileInfo);
        });

        uploader.on('stream', (fileInfo) => {
            console.log('File streaming:', fileInfo);
        });

        uploader.on('complete', (fileInfo) => {
            console.log('File upload completed:', fileInfo);
        });

        uploader.on('error', (err) => {
            console.error('Error uploading file:', err);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};
