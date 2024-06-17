const express = require('express');
const router = express.Router();
const ScheduleController= require('../controller/scheduleController');
const ROLES_LIST = require('../config/roles_list');

const scheduleRouter = (db) => {
    const scheduleController = new ScheduleController(db);

    
    router.route('/')
        .post(scheduleController.createSchedule);

    router.route('/therapist/:id')
        .get(scheduleController.getScheduleByTherapistId);
    
    router.route('/:id')
        .put(scheduleController.updateSchedule)
        .delete(scheduleController.deleteSchedule);

   

    return router;
}

module.exports = scheduleRouter;