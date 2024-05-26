const express = require('express');
const router = express.Router();
const FeedbackAndRatingController = require('../controller/feedbackAndRatingController');
const ROLES_LIST = require('../config/roles_list');

const feedbackRouter = (db) => {
    const feedbackAndRatingController = new FeedbackAndRatingController(db);

    router.route('/')
        .get(feedbackAndRatingController.getFeedbacks)
        .post(feedbackAndRatingController.createFeedback)
    router.route('/:id')
        .get(feedbackAndRatingController.getFeedbackById)
        .put(feedbackAndRatingController.updateFeedback)
        .delete(feedbackAndRatingController.deleteFeedback)
        
    router.route('/rating')
        .get(feedbackAndRatingController.getFeedbackByRating)

    return router
}

module.exports = feedbackRouter;