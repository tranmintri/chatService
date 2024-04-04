class Conversation {
    constructor(chatId,name, participants, messages,type,deleteId) {
        this.chatId = chatId;
        this.name = name;
        this.participants = participants;
        this.messages = messages;
        this.deleteId = deleteId;
        this.type = type
    }
}

class Message {
    constructor(messageId,type,senderId,senderName,senderPicture ,content, timestamp,status) {
        this.messageId=messageId;
        this.type = type;
        this.senderId = senderId;
        this.senderName = senderName;
        this.senderPicture=senderPicture;
        this.content = content;
        this.timestamp = timestamp;
        this.status = status
    }
}

module.exports = { Conversation, Message};
