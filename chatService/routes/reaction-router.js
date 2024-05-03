const express = require('express');
const {
    addReaction,updateReaction,getAllReaction,deleteReactionById,getReactionByChatId
} = require('../controllers/reactionController');

const router = express.Router();


//add user
router.post('/reactions', addReaction);
router.put('/reactions', updateReaction);
router.get('/reactions', getAllReaction);
router.get('/reactions/chat/:chatId', getReactionByChatId);
router.delete("/reactions/:reactionId",deleteReactionById)
module.exports = {
    routes: router
}