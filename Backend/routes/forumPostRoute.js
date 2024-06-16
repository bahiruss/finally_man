const express = require('express');
const router = express.Router();
const ForumPostController = require('../controller/forumPostController');
const ROLES_LIST = require('../config/roles_list');

const forumPostRouter = (db) => {
    const forumPostController = new ForumPostController(db);

    router.route('/')
    .post(forumPostController.createForumPost); 
    
    router.route('/forum/:forumId')
        .get(forumPostController.getForumPosts);

    router.route('/:id')
        .get(forumPostController.getForumPostById)    
        .put(forumPostController.updateForumPost)     
        .delete(forumPostController.deleteForumPost); 

    

    router.route('/:id/like')
        .post(forumPostController.giveALike);         

    router.route('/:id/comments')
        .post(forumPostController.makeAComment);      
      

    router.route('/creator/posts')
        .post(forumPostController.getForumPostsByCreatorId);

    return router
}

module.exports = forumPostRouter;