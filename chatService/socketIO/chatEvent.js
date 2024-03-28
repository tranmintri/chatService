const {uploadImage,getImage,getFile,uploadFile
} = require('../util/fileProcess');
const SocketIOFile = require("socket.io-file");

module.exports = (io) => {
    io.on("connection", (socket) => {

        // global.chatSocket = socket;
        // socket.on("add-user",(userId)=>{
        //     onlineUsers.set(userId,socket.id)
        // })
        //
        // socket.on("send-msg", (data) => {
        //     console.log("send-msg")
        //     console.log(data)
        //    const sendUserSocket = onlineUsers.get(data.receiveId)
        //     console.log(onlineUsers.get(data.receiveId))
        //     // if (sendUserSocket){
        //         socket.to(sendUserSocket).emit("msg-recieve",{
        //             from: data.newMessage.senderId,
        //             message:data.newMessage.contents
        //         })
        //     // }
        // });




        //upload file
        // const uploader = new SocketIOFile(socket, {
        //     uploadDir: 'uploads',
        //     chunkSize: 10240,
        //     transmissionDelay: 0,
        // });


        // uploader.on('start', (fileInfo) => {
        //     console.log('File upload started:', fileInfo);
        // });
        //
        // uploader.on('stream', (fileInfo) => {
        //     console.log('File streaming:', fileInfo);
        // });
        //
        // uploader.on('complete', (fileInfo) => {
        //     console.log('File upload completed:', fileInfo);
        // });
        //
        // uploader.on('error', (err) => {
        //     console.error('Error uploading file:', err);
        // });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};
