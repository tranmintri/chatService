class Reaction {
    constructor(reactionId,chatId, messageId,senderId,type, timestamp ) {
        this.reactionId = reactionId;
        this.chatId = chatId;
        this.messageId = messageId;
        this.senderId = senderId;
        this.type= type;
        this.timestamp = timestamp
    }
}
module.exports={Reaction}