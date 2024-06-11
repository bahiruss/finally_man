const express = require('express');
const router = express.Router();
const TherapySessionController= require('../controller/therapySessionController');
const ROLES_LIST = require('../config/roles_list');

const therapySessionRouter = (db) => {
    const therapySessionController = new TherapySessionController(db);

    router.route('/:id')
        .get(therapySessionController.getSessionById)

    router.route('/sessionType/text-sessions')
        .post(therapySessionController.createTextSession)
        .get(therapySessionController.getTextSessions)

    router.route('/sessionType/video-sessions')
        .post(therapySessionController.createVideoSessions)
        .get(therapySessionController.getVideoSessions)
        

    return router;
}

module.exports = therapySessionRouter;