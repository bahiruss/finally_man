const Forum = require('../model/Forum');
const { v4: uuidv4 } = require('uuid');

class ForumController {
    constructor (db) {
        this.db = db;
    }

    getRecentForums = async (req, res) => {
        
        try {
            const { page = 1, limit = 10 } = req.query;

            const forumsCollection = await this.db.getDB().collection('forums');

            const totalForums = await forumsCollection.countDocuments();
            const totalPages = Math.ceil(totalForums / limit);

            const recentForums = await forumsCollection.find({}, {
                projection: {
                    _id: 0,
                    forumId: "$_forumId", 
                    forumTitle: "$_forumTitle", 
                    forumDescription: "$_forumDescription", 
                    forumCategory: "$_forumCategory", 
                    forumCreatorId: "$_forumCreatorId",
                    forumCreatorName: "$_forumCreatorName", 
                    role: "$_role", 
                    forumTimeStamp: "$_forumTimeStamp", 
                    forumTotalPosts: "$_forumTotalPosts", 
                    likes: "$_likes",
                }
            })
                .sort({ forumTimeStamp: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .toArray();

            res.json({
                /*totalPages,
                currentPage: page,
                forums:*/ recentForums
            });
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch recent forums' });
        }  
    }

    getForumById = async (req, res) => {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }
            const forumsCollection = await this.db.getDB().collection('forums');
            const forum = await forumsCollection.findOne({ _forumId: req.params.id }, {
                projection: {
                    _id: 0,
                    forumId: "$_forumId", 
                    forumTitle: "$_forumTitle", 
                    forumDescription: "$_forumDescription", 
                    forumCategory: "$_forumCategory", 
                    forumCreatorId: "$_forumCreatorId", 
                    forumCreatorName: "$_forumCreatorName", 
                    role: "$_role",
                    forumTimeStamp: "$_forumTimeStamp", 
                    forumTotalPosts: "$_forumTotalPosts", 
                    likes: "$_likes",
                }
            });
            if (!forum) {
                return res.status(404).json({ message: 'Forum not found' });
            }
            res.json(forum);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch forum' });
        }
    }

    createForum = async (req, res) => {
        try {
            const forumData = req.body;

            const forumsCollection = await this.db.getDB().collection('forums');
            const therapistCollection = await this.db.getDB().collection('therapists');
            const patientCollection = await this.db.getDB().collection('patients');

            if(!forumData.forumTitle || !forumData.forumDescription || !forumData.forumCategory || !forumData.forumCreatorId) {
                return res.status(400).json({ message: 'Missing required fields! '});
            }

            const patient = await patientCollection.findOne({ _userId: forumData.forumCreatorId });
            const therapist = await therapistCollection.findOne({ _userId: forumData.forumCreatorId });

            
            const forum = new Forum();
            forum.forumId = uuidv4();
            forum.forumTitle = forumData.forumTitle;
            forum.forumDescription = forumData.forumDescription;
            forum.forumCategory = forumData.forumCategory;
            forum.forumCreatorId = forumData.userId;
            forum.forumCreatorName = patient ? patient._username : therapist._username;
            forum.role = patient ? 'Patient' : 'Therapist';
            forum.forumTimeStamp = new Date();
            forum.forumTotalPosts = 0;
            forum.likes = 0;

            await forumsCollection.insertOne(forum);
            res.status(201).json({ message: 'forum created successfully', 'createdForum': forum });
            
        } catch (error) {
            res.status(500).json({ message: 'Failed to create forum'});
        }
    }

    updateForum = async (req, res) => {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }

            const forumData = req.body;
            const forumsCollection = await this.db.getDB().collection('forums');
            
            const forumId = req.params.id;

            const existingForum = await forumsCollection.findOne({ _forumId: forumId });

            if (!existingForum) {
                return res.status(404).json({ message: 'forum not found' });
            }

            const updatedData = await forumsCollection.updateOne(
                { _forumId: forumId },
                { $set: {
                _forumTitle: forumData.forumTitle || existingForum._forumTitle,
                _forumDescription: forumData.forumDescription || existingForum._forumDescription, 
                _forumCategory: forumData.forumCategory || existingForum._forumCategory, 
                _forumTimeStamp: new Date(), 
                } }
            );
            res.json({ message: 'forum updated successfully', updatedforum: updatedData });
        } catch (error) {
            res.status(500).json({ message: 'Failed to update forum' });
        }
    }

    giveALike = async (req, res) => {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ message: 'Resource ID is required' });
            }
    
            const resourceCollection = await this.db.getDB().collection('resources');
            const existingResource = await resourceCollection.findOne({ _resourceId: req.params.id });
    
            if (!existingResource) {
                return res.status(404).json({ message: 'Resource not found' });
            }
    
            // Increase like count by one using $inc operator
            await resourceCollection.updateOne(
                { _resourceId: req.params.id },
                { $inc: { _likes: 1 } }
            );
    
            res.status(200).json({ message: 'Liked successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to add like' });
        }
    }
    

    deleteForum = async (req, res) => {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ message: 'forum ID is required' });
            }

            const forumsCollection = await this.db.getDB().collection('forums');
            const forumId = req.params.id;

            const existingForum = await forumsCollection.findOne({ _forumId: forumId });

            if (!existingForum) {
                return res.status(404).json({ message: 'forum not found' });
            }

            await forumsCollection.deleteOne({ _forumId: forumId });
            res.json({ message: 'forum deleted successfully' });
            } catch (error) {
                res.status(500).json({ message: 'Failed to delete forum' });
            }
    }
    }




module.exports = ForumController;