const ForumPost = require('../model/ForumPost');
const { v4: uuidv4 } = require('uuid');

class ForumPostController {
    constructor(db) {
        this.db = db;
    }

    getForumPosts = async (req, res) => {
        try {
            const { forumId } = req.params;

            if (!forumId) {
                return res.status(400).json({ message: 'Forum ID is required' });
            }

            const forumPostsCollection = await this.db.getDB().collection('forumPosts');
            const forumPosts = await forumPostsCollection.find({ _forumId: forumId }, {projection: {
                _id: 0, 
                postId: "$_postId", 
                forumId: "$_forumId", 
                authorId: "$_authorId", 
                postContent: "$_postContent", 
                postTimeStamp: "$_postTimeStamp", 
                likes: "$_likes", 
                comments: "$_comments",
            }}).toArray();

            res.status(200).json(forumPosts);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch forum posts' });
        }
    }

    getForumPostById = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: 'Post ID is required' });
            }

            const forumPostsCollection = await this.db.getDB().collection('forumPosts');
            const forumPost = await forumPostsCollection.findOne({ _postId: id }, {projection: {
                _id: 0, 
                postId: "$_postId", 
                forumId: "$_forumId", 
                authorId: "$_authorId", 
                postContent: "$_postContent", 
                postTimeStamp: "$_postTimeStamp", 
                likes: "$_likes", 
                comments: "$_comments",
            }});

            if (!forumPost) {
                return res.status(404).json({ message: 'Post not found' });
            }

            res.status(200).json(forumPost);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch forum post' });
        }
    }

    getForumPostsByCreatorId = async (req, res) => {
        try {
            const { userId } = req.body;

            if (!userId) {
                return res.status(400).json({ message: 'Creator ID is required' });
            }

            const forumPostsCollection = await this.db.getDB().collection('forumPosts');
            const forumPosts = await forumPostsCollection.find({ _authorId: userId }, {projection: {
                _id: 0, 
                postId: "$_postId", 
                forumId: "$_forumId", 
                authorId: "$_authorId", 
                postContent: "$_postContent", 
                postTimeStamp: "$_postTimeStamp", 
                likes: "$_likes", 
                comments: "$_comments",
            }}).toArray();

            res.status(200).json(forumPosts);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch forum posts by creator' });
        }
    }

    createForumPost = async (req, res) => {
        try {
            const postData = req.body;

            if (!postData.forumId || !postData.authorId || !postData.postContent) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const forumPost = new ForumPost();
            forumPost.postId = uuidv4();
            forumPost.forumId = postData.forumId;
            forumPost.authorId = postData.userId ;
            forumPost.postContent = postData.postContent;
            forumPost.postTimeStamp = new Date();
            forumPost.likes = 0;
            forumPost.comments = [];

            const forumPostsCollection = await this.db.getDB().collection('forumPosts');
            const forumsCollection = await this.db.getDB().collection('forums');

            await forumPostsCollection.insertOne(forumPost);

            // Increment the forum's total posts count
            await forumsCollection.updateOne(
                { _forumId: postData.forumId },
                { $inc: { _forumTotalPosts: 1 } }
            );

            res.status(201).json({ message: 'Post created successfully', createdPost: forumPost });
        } catch (error) {
            res.status(500).json({ message: 'Failed to create post' });
        }
    }

    updateForumPost = async (req, res) => {
        try {
            const { id } = req.params;
            const { postContent } = req.body;

            if (!id || !postContent) {
                return res.status(400).json({ message: 'Post ID and content are required' });
            }

            const forumPostsCollection = await this.db.getDB().collection('forumPosts');
            const existingPost = await forumPostsCollection.findOne({ _postId: id });

            if (!existingPost) {
                return res.status(404).json({ message: 'Post not found' });
            }

            const updatedData = await forumPostsCollection.updateOne(
                { _postId: id },
                { $set: { _postContent: postContent, _postTimeStamp: new Date() } }
            );

            res.status(200).json({ message: 'Post updated successfully', updatedPost: updatedData });
        } catch (error) {
            res.status(500).json({ message: 'Failed to update post' });
        }
    }

    deleteForumPost = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: 'Post ID is required' });
            }

            const forumPostsCollection = await this.db.getDB().collection('forumPosts');
            const existingPost = await forumPostsCollection.findOne({ _postId: id });

            if (!existingPost) {
                return res.status(404).json({ message: 'Post not found' });
            }

            await forumPostsCollection.deleteOne({ _postId: id });

            res.status(200).json({ message: 'Post deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete post' });
        }
    }

    makeAComment = async (req, res) => {
        try {
            const { id } = req.params;
            const commentData = req.body;

            if (!id || !commentData.comment || !commentData.authorId) {
                return res.status(400).json({ message: 'Post ID, comment, and author ID are required' });
            }

            const forumPostsCollection = await this.db.getDB().collection('forumPosts');
            const existingPost = await forumPostsCollection.findOne({ _postId: id });

            if (!existingPost) {
                return res.status(404).json({ message: 'Post not found' });
            }

            const newComment = {
                commentId: uuidv4(),
                authorId: commentData.authorId,
                comment: commentData.comment,
                commentTimeStamp: new Date()
            };

            await forumPostsCollection.updateOne(
                { _postId: id },
                { $push: { _comments: newComment } }
            );

            res.status(200).json({ message: 'Comment added successfully', newComment });
        } catch (error) {
            res.status(500).json({ message: 'Failed to add comment' });
        }
    }

    giveALike = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: 'Post ID is required' });
            }

            const forumPostsCollection = await this.db.getDB().collection('forumPosts');
            const existingPost = await forumPostsCollection.findOne({ _postId: id });

            if (!existingPost) {
                return res.status(404).json({ message: 'Post not found' });
            }

            await forumPostsCollection.updateOne(
                { _postId: id },
                { $inc: { _likes: 1 } }
            );

            res.status(200).json({ message: 'Liked successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to add like' });
        }
    }
}

module.exports = ForumPostController;
