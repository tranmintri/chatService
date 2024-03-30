class Request {
    constructor(requestId, senderId, receiverId, isAccepted) {
        this.requestId = requestId;
        this.senderId = senderId;
        this.receiverId = receiverId; 
        this.isAccepted = isAccepted;
    }
}
module.exports = {Request}
