const express = require('express');
const router = express.Router();
const BookingController= require('../controller/bookingController');
const ROLES_LIST = require('../config/roles_list');


const bookingRouter = (db) => {
    const bookingController = new BookingController(db);

    router.route('/')
    .post(bookingController.createBooking);

    router.route('/:id')
    .get(bookingController.getBookingById);

    router.route('/:id/cancel')
    .put(bookingController.cancelBooking);

    router.route('/location/:sessionLocation/sessionMode/:sessionMode')
    .get(bookingController.getBookingsByLocation);

    router.route('/sessionMode/:sessionMode/sessionType/:sessionType')
    .get(bookingController.getBookingsBySessionType);


    return router;
}

module.exports = bookingRouter;