const express = require('express');
const router = express.Router();
const TherapySessionController= require('../controller/therapySessionController');
const ROLES_LIST = require('../config/roles_list');

const therapySessionRouter = (db) => {
    const therapySessionController = new TherapySessionController(db);

    router.route('/:id')
        .get(therapySessionController.getSessionById)

    router.route('/text-sessions')
        .post(therapySessionController.createTextSession)

    router.route('/text-sessions/user/:id')
        .get(therapySessionController.getTextSessions)

    router.route('/video-sessions')
        .post(therapySessionController.createVideoSessions)

    router.route('/video-sessions/user/:id')
        .get(therapySessionController.getVideoSessions)
        

    return router;
}

module.exports = therapySessionRouter;