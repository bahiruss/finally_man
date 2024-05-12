const express = require('express');
const router = express.Router();
const multer = require('multer');
const AdministratorController= require('../controller/administratorController');
const ROLES_LIST = require('../config/roles_list');
const upload = multer();

const AdministratorRouter = (db) => {
    const administratorController = new AdministratorController(db);
    router.route('/')
        .get(administratorController.getAllAdministrator)
        .post(upload.single('profilePic'), administratorController.createAdministrator);
    router.route('/:id')
        .get(administratorController.getAdministrator)
        .put(upload.single('profilePic'), administratorController.updateAdministrator)
        .delete(administratorController.deleteAdministrator)

    return router;
}

module.exports = AdministratorRouter;