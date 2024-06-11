const express = require('express');
const router = express.Router();
const MessageController = require('../controller/messageController');
const ROLES_LIST = require('../config/roles_list');

const messageRouter = (db) => {
    const messageController = new MessageController(db);

    router.route('/')
    .post(messageController.createMessage)
        
        
    router.route('/session/:sessionId')
    .get(messageController.getMessages)
        
    router.route('/:id')
        .get(messageController.getMessageById)
        .put(messageController.updateMessage)
        .delete(messageController.deleteMessage)

    return router;
}

module.exports = messageRouter;