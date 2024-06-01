const express = require('express');
const router = express.Router();
const ForumController = require('../controller/forumController');
const ROLES_LIST = require('../config/roles_list');

const forumRouter = (db) => {
    const forumController = new ForumController(db);

    router.route('/')
        .get(forumController.getRecentForums)    // Get recent forums
        .post(forumController.createForum);      // Create a new forum

    router.route('/:id')
        .get(forumController.getForumById)       // Get a forum by ID
        .put(forumController.updateForum)        // Update a forum by ID
        .delete(forumController.deleteForum);    // Delete a forum by ID

    router.route('/:id/like')
        .post(forumController.giveALike); 

    return router
}

module.exports = forumRouter;