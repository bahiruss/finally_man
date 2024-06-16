const express = require('express');
const router = express.Router();
const ForumController = require('../controller/forumController');
const ROLES_LIST = require('../config/roles_list');

const forumRouter = (db) => {
    const forumController = new ForumController(db);

    router.route('/')
        .get(forumController.getRecentForums)    
        .post(forumController.createForum);  
        
    router.route('/category/:category')
    .get(forumController.getForumsByCategory)

    router.route('/myforums')
        .get(forumController.getMyForums)

    router.route('/search')
        .get(forumController.searchForums)

    router.route('/like/:id')
        .put(forumController.giveALike);

    router.route('/:id')
        .get(forumController.getForumById)       
        .put(forumController.updateForum)        
        .delete(forumController.deleteForum);     

    return router
}

module.exports = forumRouter;