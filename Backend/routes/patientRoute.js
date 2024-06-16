const express = require('express');
const router = express.Router();
const multer = require('multer');
const PatientController= require('../controller/patientController');
const ROLES_LIST = require('../config/roles_list');
const upload = multer();

const patientRouter = (db) => {
    const patientController = new PatientController(db);
    router.route('/')
        .get(patientController.getAllPatients)
        .post(upload.single('profilePic'), patientController.createPatient);

    router.route('/userId/:id')
        .get(patientController.getPatientByUserId);

    router.route('/:id')
        .get(patientController.getPatient)
        .put(upload.single('profilePic'), patientController.updatePatient)
        .delete(patientController.deletePatient)


    return router;
}

module.exports = patientRouter;