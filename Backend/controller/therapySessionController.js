const TherapySession = require('../model/TherapySession');
const { v4: uuidv4 } = require('uuid');

class TherapySessionController {
    constructor (db) {
        this.db = db;
    }

    getVideoSessions = async (req, res) => {
        try{
            const userId  = req.body.userId;

            const patientCollection = await this.db.getDB().collection('patients');
            const therapistCollection = await this.db.getDB().collection('therapists');
            const therapySessionsCollection = await this.db.getDB().collection('therapysessions');

            const therapist = await therapistCollection.findOne({_userId : userId });
            const patient = await patientCollection.findOne({_userId : userId });

            // if therapist requests the api end point
            if(therapist){
                const videoSessions = await therapySessionsCollection.find({ _therapistId: therapist._therapistId, _sessionType: 'video-chat'}, {
                    projection: {
                        _id: 0,
                        sessionId: "$_sessionId",
                        therapistId: "$_therapistId",
                        therapistName: "$_therapistName",
                        patientInfo: '$_patientInfo',

                        sessionType: "$_sessionType",
                        sessionStartTime: "$_sessionStartTime",
                        sessionEndTime: "$_sessionEndTime",  
                    }
                }).toArray();
                if (!videoSessions.length) return res.status(204).json({ 'message': 'No videoSessions found' });
                res.json(videoSessions);
            }

            //if a patient requests the api endpoint
            if(patient){
                const videoSessions = await therapySessionsCollection.find({ '_patientInfo.id': patient._patientId, _sessionType: 'video-chat'}, {
                    projection: {
                        _id: 0,
                        sessionId: "$_sessionId",
                        therapistId: "$_therapistId",
                        therapistName: "$_therapistName",
                        patientInfo: '$_patientInfo',

                        sessionType: "$_sessionType",
                        sessionStartTime: "$_sessionStartTime",
                        sessionEndTime: "$_sessionEndTime",  
                    }
                }).toArray();
                if (!videoSessions.length) return res.status(204).json({ 'message': 'No videoSessions found' });
                res.json(videoSessions);
            }
            
        } catch (error) {
            console.log(error);
        res.status(500).json({ 'message': 'Failed to fetch videoSessions' });
        }
    }

    getTextSessions = async (req, res) => {
        try{
            const userId  = req.body.userId;
            console.log(req.body)
            const patientCollection = await this.db.getDB().collection('patients');
            const therapistCollection = await this.db.getDB().collection('therapists');
            const therapySessionsCollection = await this.db.getDB().collection('therapysessions');

            const therapist = await therapistCollection.findOne({_userId : userId });
            const patient = await patientCollection.findOne({_userId : userId });
            console.log(therapist, patient)
     
            

            // if therapist requests the api end point
            if(therapist){
                const chatSessions = await therapySessionsCollection.find({ _therapistId: therapist._therapistId, _sessionType: 'text-chat'}, {
                    projection: {
                        _id: 0,
                        sessionId: "$_sessionId",
                        therapistId: "$_therapistId",
                        therapistName: "$_therapistName",
                        patientInfo: '$_patientInfo',

                        sessionType: "$_sessionType",
                        sessionStartTime: "$_sessionStartTime",
                        sessionEndTime: "$_sessionEndTime",  
                    }
                }).toArray();
                if (!chatSessions.length) return res.status(204).json({ 'message': 'No chatSessions found' });
                res.json(chatSessions);
            }

            //if a patient requests the api endpoint
            if(patient){
                console.log('hi')
                const chatSessions = await therapySessionsCollection.find({ '_patientInfo.id': patient._patientId, _sessionType: 'text-chat'}, {
                    projection: {
                        _id: 0,
                        sessionId: "$_sessionId",
                        therapistId: "$_therapistId",
                        therapistName: "$_therapistName",
                        patientInfo: '$_patientInfo',

                        sessionType: "$_sessionType",
                        sessionStartTime: "$_sessionStartTime",
                        sessionEndTime: "$_sessionEndTime",  
                    }
                }).toArray();
                if (!chatSessions.length) return res.status(204).json({ 'message': 'No chatSessions found' });
                console.log(chatSessions)
                res.json(chatSessions);
            }
            
        } catch (error) {
            console.log(error);
        res.status(500).json({ 'message': 'Failed to fetch chatSessions' });
        }
    }

    getSessionById = async (req, res) => {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }
    
            const therapySessionsCollection = await this.db.getDB().collection('therapysessions');
    
            const therapySession = await therapySessionsCollection.findOne({ _sessionId: req.params.id },{
                projection: {
                    _id: 0,
                    sessionId: "$_sessionId",
                    therapistId: "$_therapistId",
                    therapistName: "$_therapistName",
                    patientInfo: '$_patientInfo',
                    sessionType: "$_sessionType",
                    sessionStartTime: "$_sessionStartTime",
                    sessionEndTime: "$_sessionEndTime",  
                }
            })
    
            if (!therapySession) {
                return res.status(404).json({ message: 'TherapySession not found' });
            }
    
            res.json(therapySession);    
        } catch (error) {
            console.error('Error fetching therapy session:', error);
            res.status(500).json({ 'message': 'Failed to fetch therapy session' });
        }
            }

    createVideoSessions = async (req, res) => {
        try{
            const therapySessionData = req.body;

            const therapistCollection = await this.db.getDB().collection('therapists');
            const therapySessionsCollection = await this.db.getDB().collection('therapysessions');

            //check if all required fields are there

    
            const therapist = await therapistCollection.findOne({_therapistId: therapySessionData.therapistId});

            //create an model object
            const therapySession = new TherapySession();

            therapySession.sessionId = uuidv4();
            therapySession.patientInfo = therapySessionData.patientInfo;
            therapySession.therapistId = therapySessionData.therapistId;
            therapySession.therapistName = therapist._name;
            therapySession.sessionType = 'video-chat';
            therapySession.sessionStartTime = therapySessionData.sessionStartTime;
            therapySession.sessionEndTime = null;
            

            await therapySessionsCollection.insertOne(therapySession);

        res.status(201).json({ 'message': 'therapy session(video) created successfully', 'therapySession': therapySession });
        } catch (error) {
            console.error('Error creating therapySession:', error);
            res.status(500).json({ 'message': 'Failed to create therapysession' });
        }

    }

    createTextSession = async (req, res) => {
        try{
            const therapySessionData = req.body;

            const therapistCollection = await this.db.getDB().collection('therapists');
            const therapySessionsCollection = await this.db.getDB().collection('therapysessions');

    
            const therapist = await therapistCollection.findOne({_therapistId: therapySessionData.therapistId});
            

            //create an model object
            const therapySession = new TherapySession();

            therapySession.sessionId = uuidv4();
            therapySession.patientInfo = therapySessionData.patientInfo;
            therapySession.therapistId = therapySessionData.therapistId;
            therapySession.therapistName = therapist._name;
            therapySession.sessionType = 'text-chat';
            therapySession.sessionStartTime = therapySessionData.sessionStartTime;

            await therapySessionsCollection.insertOne(therapySession);

        res.status(201).json({ 'message': 'therapy session(text) created successfully', 'therapySession': therapySession });
        } catch (error) {
            console.error('Error creating therapySession:', error);
            res.status(500).json({ 'message': 'Failed to create therapysession' });
        }

    }

}

module.exports = TherapySessionController;
