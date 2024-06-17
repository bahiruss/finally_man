const FeedbackAndRating = require('../model/FeedbackAndRating');
const { v4: uuidv4 } = require('uuid');

class FeedbackAndRatingController {
    constructor (db) {
        this.db = db;
    }

    getFeedbacks = async (req, res) => {
        try {
            const feedbackAndRatingCollection = await this.db.getDB().collection('feedbacksandratings');

            const feedbacks = await feedbackAndRatingCollection.find({ _therapistId: req.params.id }, {
                projection: {
                    _id: 0,
                    feedbackId: "$_feedbackId",
                    raterId: "$_raterId",
                    raterName: "$_raterName",
                    therapistId: "$_therapistId",
                    rating: "$_rating",
                    comment: "$_comment",
                    timeStamp: "$_timeStamp",
                }
            }).toArray();

            if (!feedbacks.length) return res.status(204).json({ message: 'No feedbacks found' });

            const totalFeedbacks = await feedbackAndRatingCollection.countDocuments({ _therapistId: req.params.id });

            res.json({ feedbacks, totalFeedbacks });

        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch feedbacks' });
        }
    }

    getFeedbackById = async (req, res) => {
        try{
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }
            const feedbackAndRatingCollection = await this.db.getDB().collection('feedbacksandratings');


            const feedback = await feedbackAndRatingCollection.findOne({_feedbackId: req.params.id}, {
                projection: {
                    _id: 0,
                    feedbackID: "$_feedbackId", 
                    raterId: "$_raterId",
                    raterName: "$_raterName",
                    therapistId: "$_therapistId", 
                    rating: "$_rating",
                    comment: "$_comment",
                    timeStamp: "$_timeStamp",
                }
            })

            if (!feedback) return res.status(404).json({ message: 'No feedbacks found' });

            res.json(feedback);

        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch feedback' });
        }   
    }

    getFeedbackByRating = async (req, res) => {
        try {
            const { rating } = req.query;

            if (!rating) {
                return res.status(400).json({ message: 'Rating parameter is required' });
            }

            const feedbackAndRatingCollection = await this.db.getDB().collection('feedbacksandratings');
            

            const feedbacks = await feedbackAndRatingCollection.find({ _rating: parseInt(rating), _therapistId: req.params.id }, {
                projection: {
                    _id: 0,
                    feedbackID: "$_feedbackId", 
                    raterId: "$_raterId",
                    raterName: "$_raterName",
                    therapistId: "$_therapistId", 
                    rating: "$_rating",
                    comment: "$_comment",
                    timeStamp: "$_timeStamp",
                }
            }).toArray();

            if (!feedbacks.length) return res.status(204).json({ message: 'No feedbacks found for the given rating' });

            res.json(feedbacks);

        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch feedbacks by rating' });
        }     
    }

    createFeedback = async (req, res) => {
            try {
                const feedbackData = req.body;

                const feedbackAndRatingCollection = await this.db.getDB().collection('feedbacksandratings');
                const patientCollection = await this.db.getDB().collection('patients');

                const patient = await patientCollection.findOne({ _userId: feedbackData.userId });
                //check if the patient exists
                if(!patient) return res.status(404).json({ message: 'Patient can not be found'});

                //check for missing fields
                if(!feedbackData.userId || !feedbackData.therapistId || !feedbackData.rating || !feedbackData.comment)
                {
                    return res.status(400).json({ message: 'missing required fields '});
                }

                // Check if the rating is between 1 and 5
                const rating = parseFloat(feedbackData.rating);
                if (rating < 1 || rating > 5) {
                    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
                }

                const feedbackAndRating = new FeedbackAndRating();
                feedbackAndRating.feedbackId = uuidv4(); 
                feedbackAndRating.raterId = feedbackData.userId; 
                feedbackAndRating.raterName = patient._name;
                feedbackAndRating.therapistId = feedbackData.therapistId; 
                feedbackAndRating.rating = feedbackData.rating;
                feedbackAndRating.comment = feedbackData.comment;
                feedbackAndRating.timeStamp = new Date();

                await feedbackAndRatingCollection.insertOne(feedbackAndRating);
                console.log('hi', feedbackAndRating)
                res.status(201).json({ message: 'feedback and rating created successfully', createdFeedbackAndRating: feedbackAndRating});


            } catch (error) {
                res.status(500).json({ message: 'Failed to create feedback'});
                console.log(error)
            }
    }

    updateFeedback = async (req, res) => {
      try {
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }

            const feedbackData = req.body;
            const feedbackAndRatingCollection = await this.db.getDB().collection('feedbacksandratings');
            const feedbackId = req.params.id;

            const existingFeedback = await feedbackAndRatingCollection.findOne({ _feedbackId: feedbackId });

            if (!existingFeedback) {
                return res.status(404).json({ message: 'Feedback not found' });
            }

            if(feedbackData.userId !== existingFeedback._raterId) {
                return res.status(401).json({ message: 'Not authorized to update this feedback' });
            }
            const updatedData = { 
                _raterId: existingFeedback._raterId,
                _raterName: existingFeedback._raterName,
                _therapistId: existingFeedback._therapistId,
                _rating: feedbackData.rating || existingFeedback._rating,
                _comment: feedbackData.comment || existingFeedback._comment,
                _timeStamp: new Date()
            };

            await feedbackAndRatingCollection.updateOne(
                { _feedbackId: feedbackId },
                { $set: updatedData }
            );
            res.json({ message: 'Feedback updated successfully', updatedFeedback: updatedData });
        } catch (error) {
            res.status(500).json({ message: 'Failed to update feedback' });
        }   
    }

    deleteFeedback = async (req, res) => {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ message: 'Feedback ID is required' });
            }

            const feedbackAndRatingCollection = await this.db.getDB().collection('feedbacksandratings');
            const feedbackId = req.params.id;

            const existingFeedback = await feedbackAndRatingCollection.findOne({ _feedbackId: feedbackId });

            if (!existingFeedback) {
                return res.status(404).json({ message: 'Feedback not found' });
            }

            if (req.body.userId !== existingFeedback._raterId) {
                return res.status(404).json({ message: 'Not user to delete this feedback' });
            }

            await feedbackAndRatingCollection.deleteOne({ _feedbackId: feedbackId });
            res.json({ message: 'Feedback deleted successfully' });
            } catch (error) {
                res.status(500).json({ message: 'Failed to delete feedback' });
            }
    }
}

module.exports = FeedbackAndRatingController;