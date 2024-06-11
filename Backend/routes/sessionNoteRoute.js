const express = require('express');
const router = express.Router();
const SessionNoteController = require('../controller/sessionNoteController');
const ROLES_LIST = require('../config/roles_list');

const sessionNoteRouter = (db) => {
    const sessionNoteController = new SessionNoteController(db);

    router.route('/')
        .post(sessionNoteController.createNote);
    
    router.route('/session/:sessionId')
        .get(sessionNoteController.getNotes);

    router.route('/:id')
        .get(sessionNoteController.getNoteById)
        .put(sessionNoteController.updateNote)
        .delete(sessionNoteController.deleteNote);

    return router
}

module.exports = sessionNoteRouter;