const FeedbackAndRating = require('../model/FeedbackAndRating');
const { v4: uuidv4 } = require('uuid');

class FeedbackAndRatingController {
    constructor (db) {
        this.db = db;
    }

    getFeedbacks = async (req, res) => {
        try{
            const { page = 1, limit = 10 } = req.query; 

            const feedbackAndRatingCollection = await this.db.getDB().collection('feedbacksandratings');

            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            const feedbacks = await feedbackAndRatingCollection.find({}, {
                projection: {
                    _id: 0,
                    _feedbackId 
                    _raterId
                    _therapistId 
                    _rating 
                    _comment
                    _timeStamp
                }
            }).sort({ _resourceTimeStamp: -1 }).skip(startIndex).limit(limit).toArray();

            if (!feedbacks.length) return res.status(204).json({ message: 'No feedbacks found' });

            res.json(feedbacks);

        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch feedbacks' });
        }
    }

    getFeedbackById = async (req, res) => {
        
    }

    createFeedback = async (req, res) => {
        
    }

    updateFeedback = async (req, res) => {
        
    }

    deleteFeedback = async (req, res) => {
        
    }
}