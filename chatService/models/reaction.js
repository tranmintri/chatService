class Reaction {
    constructor(chatId, messageId,senderId,type, timestamp ) {
        this.chatId = chatId;
        this.messageId = messageId;
        this.senderId = senderId;
        this.type= type;
        this.timestamp = timestamp
    }
}
module.exports={Reaction}