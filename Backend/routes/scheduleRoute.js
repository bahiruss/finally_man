const express = require('express');
const router = express.Router();
const ScheduleController= require('../controller/scheduleController');
const ROLES_LIST = require('../config/roles_list');

const scheduleRouter = (db) => {
    const scheduleController = new ScheduleController(db);

    
    router.route('/')
        .post(scheduleController.createSchedule)

    router.route('/:id')
        .get(scheduleController.getScheduleByTherapistId)
        .put(scheduleController.updateSchedule)


    return router;
}

module.exports = scheduleRouter;