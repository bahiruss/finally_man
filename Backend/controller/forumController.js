const Forum = require('../model/Forum');
const { v4: uuidv4 } = require('uuid');

class ForumController {
    constructor (db) {
        this.db = db;
    }

    getRecentForums = async (req, res) => {
        try {
            let { page = 1, limit = 10 } = req.query;

            page = parseInt(page);
            limit = parseInt(limit)

            const forumsCollection = this.db.getDB().collection('forums');
            const totalForums = await forumsCollection.countDocuments();

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
                    likesBy: "$_likesBy"
                }
            })
            .sort({ forumTimeStamp: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray();

            res.json({ totalForums, forums: recentForums });
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch recent forums' });
        }  
    }

    getForumById = async (req, res) => {
        try {
            console.log('hiii')
            if (!req?.params?.id) {
                return res.status(400).json({ message: 'ID parameter is required' });
            }
            const forumsCollection = this.db.getDB().collection('forums');
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
                    likesBy: "$_likesBy"
                }
            });
            if (!forum) {
                return res.status(404).json({ message: 'Forum not found' });
            }
            res.json([forum]);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch forum' });
            console.log(error)
        }
    }

    getForumsByCategory = async (req, res) => {
        try {
            const { category } = req.params;
            let { page = 1, limit = 10 } = req.query;

            page = parseInt(page);
            limit = parseInt(limit)

            const forumsCollection = this.db.getDB().collection('forums');

            const totalForums = await forumsCollection.countDocuments({ _forumCategory: category });

            const forums = await forumsCollection.find({ _forumCategory: category }, {
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
                    likesBy: "$_likesBy"
                }
            })
            .sort({ forumTimeStamp: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray();

            res.json({ totalForums, forums });
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch forums by category' });
        }
    }
    getMyForums = async (req, res) => {
        try {
            const { category } = req.params;
            let { page = 1, limit = 10 } = req.query;

            page = parseInt(page);
            limit = parseInt(limit)

            const forumsCollection = this.db.getDB().collection('forums');

            const totalForums = await forumsCollection.countDocuments({ _forumCreatorName: category });

            const forums = await forumsCollection.find({ _forumCreatorId: req.body.userId }, {
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
                    likesBy: "$_likesBy"
                }
            })
            .sort({ forumTimeStamp: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray();

            res.json({ totalForums, forums });
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch forums by category' });
            console.log(error)
        }
    }

    searchForums = async (req, res) => {
        try {
            let { search } = req.query;
            let { page = 1, limit = 10 } = req.query;
            const forumsCollection = this.db.getDB().collection('forums');
            search = search ? search : ''

            page = parseInt(page);
            limit = parseInt(limit)

            const searchQuery = {
                $or: [
                    { _forumTitle: { $regex: `.*${search}.*`, $options: 'i' } },
                    { _forumCreatorName: { $regex: `.*${search}.*`, $options: 'i' } }
                ]
            };

            const forums = await forumsCollection.find(searchQuery, {
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
                    likesBy: "$_likesBy"
                }
            }).sort({ forumTimeStamp: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray();

            const totalCount = await forumsCollection.countDocuments(searchQuery);
            if (!forums.length) return res.status(204).json({ message: 'No forums found' });
           

            res.json({ forums, totalCount });
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch forums' });
            console.log(error)
            
        }
    }

    createForum = async (req, res) => {
        try {
            const forumData = req.body;
            const forumsCollection = this.db.getDB().collection('forums');
            const therapistCollection = this.db.getDB().collection('therapists');
            const patientCollection = this.db.getDB().collection('patients');

            if (!forumData.forumTitle || !forumData.forumDescription || !forumData.forumCategory ) {
                return res.status(400).json({ message: 'Missing required fields!' });
            }

            const [patient, therapist] = await Promise.all([
                patientCollection.findOne({ _userId: forumData.userId }),
                therapistCollection.findOne({ _userId: forumData.userId })
            ]);


            const forum = new Forum();
                forum.forumId = uuidv4(),
                forum.forumTitle = forumData.forumTitle,
                forum.forumDescription = forumData.forumDescription,
                forum.forumCategory = forumData.forumCategory,
                forum.forumCreatorId = forumData.userId,
                forum.forumCreatorName = patient ? patient._username : therapist._username,
                forum.role = patient ? 'Patient' : 'Therapist',
                forum.forumTimeStamp = new Date(),
                forum.forumTotalPosts = 0,
                forum.likes = 0,
                forum.likesBy = []
                
            await forumsCollection.insertOne(forum);
            res.status(201).json({ message: 'Forum created successfully', createdForum: forum });
        } catch (error) {
            res.status(500).json({ message: 'Failed to create forum' });
            console.log(error)
        }
    }

    updateForum = async (req, res) => {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ message: 'ID parameter is required' });
            }

            const forumData = req.body;
            const forumsCollection = this.db.getDB().collection('forums');
            const forumId = req.params.id;

            const existingForum = await forumsCollection.findOne({ _forumId: forumId });

            if (!existingForum) {
                return res.status(404).json({ message: 'Forum not found' });
            }

            const updatedData = await forumsCollection.updateOne(
                { _forumId: forumId },
                { $set: {
                    _forumTitle: forumData.forumTitle || existingForum._forumTitle,
                    _forumDescription: forumData.forumDescription || existingForum._forumDescription,
                    _forumCategory: forumData.forumCategory || existingForum._forumCategory,
                    _forumTimeStamp: new Date()
                } }
            );
            res.json({ message: 'Forum updated successfully', updatedForum: updatedData });
        } catch (error) {
            res.status(500).json({ message: 'Failed to update forum' });
        }
    }

    giveALike = async (req, res) => {
        try {
            console.log('hi')
            if (!req?.params?.id) {
                return res.status(400).json({ message: 'Forum ID is required' });
            }

            const userId = req.body.userId;

            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }

            const db = this.db.getDB();
            const forumsCollection = db.collection('forums');
            const patientCollection = db.collection('patients');
            const therapistCollection = db.collection('therapists');

            const [existingForum, patient, therapist] = await Promise.all([
                forumsCollection.findOne({ _forumId: req.params.id }),
                patientCollection.findOne({ _userId: userId }),
                therapistCollection.findOne({ _userId: userId })
            ]);

            if (!existingForum) {
                return res.status(404).json({ message: 'Forum not found' });
            }

            const username = patient ? patient._username : therapist ? therapist._username : null;

            if (!username) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (!Array.isArray(existingForum._likesBy)) {
                existingForum._likesBy = [];
            }

            let likeStatus;

            // Check if user has already liked the forum
            if (existingForum._likesBy.includes(username)) {
                // Unlike the forum
                await forumsCollection.updateOne(
                    { _forumId: req.params.id },
                    {
                        $inc: { _likes: -1 },
                        $pull: { _likesBy: username }
                    }
                );
                likeStatus = 'unliked';
            } else {
                // Like the forum
                const updateForum = await forumsCollection.updateOne(
                    { _forumId: req.params.id },
                    {
                        $inc: { _likes: 1 },
                        $push: { _likesBy: username }
                    }
                );
                likeStatus = 'liked';
            } 
                const updateForum = await forumsCollection.findOne(
                    { _forumId: req.params.id }
                )


            res.status(200).json([updateForum]);
        } catch (error) {
            res.status(500).json({ message: 'Failed to toggle like' });
            console.error(error);
        }
    }

    deleteForum = async (req, res) => {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ message: 'Forum ID is required' });
            }

            const forumsCollection = this.db.getDB().collection('forums');
            const forumId = req.params.id;

            const existingForum = await forumsCollection.findOne({ _forumId: forumId });

            if (!existingForum) {
                return res.status(404).json({ message: 'Forum not found' });
            }

            await forumsCollection.deleteOne({ _forumId: forumId });
            res.json({ message: 'Forum deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete forum' });
        }
    }
}

module.exports = ForumController;
