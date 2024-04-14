class Conversation {
    constructor(chatId, name, picture, participants, messages, type, deleteId,managerId) {
        this.chatId = chatId;
        this.picture = picture
        this.name = name;
        this.participants = participants;
        this.messages = messages;
        this.type = type,
            this.deleteId = deleteId;
        this.managerId = managerId
    }
}

class Message {
    constructor(messageId, type, senderId, senderName, senderPicture, content, timestamp, status) {
        this.messageId = messageId;
        this.type = type;
        this.senderId = senderId;
        this.senderName = senderName;
        this.senderPicture = senderPicture;
        this.content = content;
        this.timestamp = timestamp;
        this.status = status
    }
}

module.exports = {Conversation, Message};
