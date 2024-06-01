const express = require('express');
const router = express.Router();
const ROLES_LIST = require('../config/roles_list');
const AuthController = require('../controller/authController');

const authRouter = (db) => {
    const authController = new AuthController(db);

    router.post('/login', authController.handleLogin);
    router.post('/logout', authController.handleLogout);


    return router
}


module.exports = authRouter;
