const express = require('express');
const router = express.Router();
const multer = require('multer');
const CustomerandCrisisController= require('../controller/customerAndCrisisSupportController');
const ROLES_LIST = require('../config/roles_list');
const upload = multer();

const customerAndCrisisSupportRouter = (db) => {
    const customerAndCrisisSupportController = new CustomerandCrisisController(db);
    router.route('/')
        .get(customerAndCrisisSupportController.getAllCustomerAndCrisisSupport)
        .post(upload.single('profilePic'), customerAndCrisisSupportController.createCustomerAndCrisis);
    router.route('/:id')
        .get(customerAndCrisisSupportController.getCustomerAndCrisisSupport)
        .put(upload.single('profilePic'), customerAndCrisisSupportController.updateCustomerAndCrisisSupport)
        .delete(customerAndCrisisSupportController.deleteCustomerAndCrisisSupport)

    return router;
}

module.exports = customerAndCrisisSupportRouter;