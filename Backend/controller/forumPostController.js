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
            const forumPosts = await forumPostsCollection.find({ _forumId: forumId }, {
                projection: {
                    _id: 0,
                    postId: "$_postId",
                    forumId: "$_forumId",
                    authorId: "$_authorId",
                    postCreatorUsername: "$_postCreatorUsername",
                    postContent: "$_postContent",
                    postTimeStamp: "$_postTimeStamp",
                    likes: "$_likes",
                    comments: "$_comments",
                }
            }).toArray();

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
            const forumPost = await forumPostsCollection.findOne({ _postId: id }, {
                projection: {
                    _id: 0,
                    postId: "$_postId",
                    forumId: "$_forumId",
                    authorId: "$_authorId",
                    postCreatorUsername: "$_postCreatorUsername",
                    postContent: "$_postContent",
                    postTimeStamp: "$_postTimeStamp",
                    likes: "$_likes",
                    comments: "$_comments",
                }
            });

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
            const forumPosts = await forumPostsCollection.find({ _authorId: userId }, {
                projection: {
                    _id: 0,
                    postId: "$_postId",
                    forumId: "$_forumId",
                    authorId: "$_authorId",
                    postCreatorUsername: "$_postCreatorUsername",
                    postContent: "$_postContent",
                    postTimeStamp: "$_postTimeStamp",
                    likes: "$_likes",
                    comments: "$_comments",
                }
            }).toArray();

            res.status(200).json(forumPosts);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch forum posts by creator' });
        }
    }

    createForumPost = async (req, res) => {
        try {
            const postData = req.body;
            console.log('hi')

            if (!postData.forumId || !postData.postContent) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const db = this.db.getDB();
            const forumPostsCollection = db.collection('forumPosts');
            const forumsCollection = db.collection('forums');
            const patientCollection = db.collection('patients');
            const therapistCollection = db.collection('therapists');

            const [patient, therapist] = await Promise.all([
                patientCollection.findOne({ _userId: postData.userId }),
                therapistCollection.findOne({ _userId: postData.userId })
            ]);

            const forumPost = new ForumPost();
            forumPost.postId = uuidv4();
            forumPost.forumId = postData.forumId;
            forumPost.authorId = postData.userId;
            forumPost.postCreatorUsername =  patient ? patient._username : therapist._username,
            forumPost.postContent = postData.postContent;
            forumPost.postTimeStamp = new Date();
            forumPost.likes = 0;
            forumPost.comments = [];

            await forumPostsCollection.insertOne(forumPost);

            // Increment the forum's total posts count
            await forumsCollection.updateOne(
                { _forumId: postData.forumId },
                { $inc: { _forumTotalPosts: 1 } }
            );

            res.status(201).json({
                postId: forumPost.postId,
                forumId: forumPost.forumId,
                authorId: forumPost.authorId,
                postCreatorUsername: forumPost.postCreatorUsername,
                postContent: forumPost.postContent,
                postTimeStamp: forumPost.likes,
                likes: forumPost.likes,
                comments: forumPost.comments })
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

            const db = this.db.getDB();
            const forumPostsCollection = db.collection('forumPosts');
            const patientCollection = db.collection('patients');
            const therapistCollection = db.collection('therapists');

            const [existingPost, patient, therapist] = await Promise.all([
                forumPostsCollection.findOne({ _postId: id }),
                patientCollection.findOne({ _userId: commentData.authorId }),
                therapistCollection.findOne({ _userId: commentData.authorId })
            ]);

            if (!existingPost) {
                return res.status(404).json({ message: 'Post not found' });
            }

            const commentBy = patient ? patient._username : therapist._username;

            const newComment = {
                commentId: uuidv4(),
                authorId: commentData.authorId,
                comment: commentData.comment,
                commentTimeStamp: new Date(),
                commentedBy: commentBy,
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
            if (!req?.params?.id) {
                return res.status(400).json({ message: 'Post ID is required' });
            }
    
            const userId = req.body.userId;
    
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }
    
            const db = this.db.getDB();
            const forumPostsCollection = db.collection('forumPosts');
            const patientCollection = db.collection('patients');
            const therapistCollection = db.collection('therapists');
    
            const [existingPost, patient, therapist] = await Promise.all([
                forumPostsCollection.findOne({ _postId: req.params.id }),
                patientCollection.findOne({ _userId: userId }),
                therapistCollection.findOne({ _userId: userId })
            ]);
    
            if (!existingPost) {
                return res.status(404).json({ message: 'Post not found' });
            }
    
            const username = patient ? patient._username : therapist ? therapist._username : null;
    
            if (!username) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            if (!Array.isArray(existingPost._likesBy)) {
                existingPost._likesBy = [];
            }
    
            let likeStatus;
    
            // Check if user has already liked the post
            if (existingPost._likesBy.includes(username)) {
                // Unlike the post
                await forumPostsCollection.updateOne(
                    { _postId: req.params.id },
                    {
                        $inc: { _likes: -1 },
                        $pull: { _likesBy: username }
                    }
                );
                likeStatus = 'unliked';
            } else {
                // Like the post
                await forumPostsCollection.updateOne(
                    { _postId: req.params.id },
                    {
                        $inc: { _likes: 1 },
                        $push: { _likesBy: username }
                    }
                );
                likeStatus = 'liked';
            }
    
            res.status(200).json({ message: `Post ${likeStatus} successfully`, likeStatus });
        } catch (error) {
            res.status(500).json({ message: 'Failed to toggle like' });
            console.error(error);
        }
    };
    
}

module.exports = ForumPostController;
