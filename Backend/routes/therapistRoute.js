const express = require('express');
const router = express.Router();
const multer = require('multer');
const TherapistController= require('../controller/therapistController');
const ROLES_LIST = require('../config/roles_list');
const upload = multer();

const therapistRouter = (db) => {
    const therapistController = new TherapistController(db);
    router.route('/')
        .get(therapistController.getAllTherapists)
        .post(upload.single('profilePic'), therapistController.createTherapist);
    router.route('/:id')
        .get(therapistController.getTherapist)
        .put(upload.single('profilePic'), therapistController.updateTherapist)
        .delete(therapistController.deleteTherapist)

    return router;
}

module.exports = therapistRouter;