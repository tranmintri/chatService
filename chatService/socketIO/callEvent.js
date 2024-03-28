const { v4: uuidv4 } = require('uuid');
module.exports = (io) => {

    // Xử lý yêu cầu tạo mới cuộc gọi video
    io.on('connection', (socket) => {

        // Xử lý yêu cầu tạo mới cuộc gọi video
        socket.on('create-call', () => {
            const callId = uuidv4();
            activeCalls[callId] = { initiator: socket.id, participants: [socket.id] };
            socket.emit('call-created', callId);
        });

        // Xử lý yêu cầu tham gia cuộc gọi video
        socket.on('join-call', (callId) => {
            if (activeCalls[callId]) {
                activeCalls[callId].participants.push(socket.id);
                socket.emit('call-joined', callId);
                socket.to(activeCalls[callId].initiator).emit('participant-joined', socket.id);
            } else {
                socket.emit('call-error', 'Call does not exist');
            }
        });

        // Xử lý sự kiện ngắt kết nối
        socket.on('disconnect', () => {
            console.log('User disconnected');
            // Xóa người dùng ra khỏi cuộc gọi nếu có
            for (const callId in activeCalls) {
                if (activeCalls[callId].participants.includes(socket.id)) {
                    activeCalls[callId].participants = activeCalls[callId].participants.filter(id => id !== socket.id);
                    io.to(callId).emit('participant-left', socket.id);
                    if (activeCalls[callId].participants.length === 0) {
                        delete activeCalls[callId];
                    }
                }
            }
        });
    });

};