const express = require('express');
const router = express.Router();
const FeedbackAndRatingController = require('../controller/feedbackAndRatingController');
const ROLES_LIST = require('../config/roles_list');

const feedbackRouter = (db) => {
    const feedbackAndRatingController = new FeedbackAndRatingController(db);

    router.route('/')
        .post(feedbackAndRatingController.createFeedback);
    router.route('/:id')
        .get(feedbackAndRatingController.getFeedbackById)
        .put(feedbackAndRatingController.updateFeedback)
        .delete(feedbackAndRatingController.deleteFeedback);

    router.route('/therapist/:id')
    .get(feedbackAndRatingController.getFeedbacks);

    router.route('/rating/therapist/:id')
        .get(feedbackAndRatingController.getFeedbackByRating);

    return router
}

module.exports = feedbackRouter;