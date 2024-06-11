const GroupSession = require('../model/GroupSession');
const { v4: uuidv4 } = require('uuid');
class GroupSessionController {
    constructor (db) {
        this.db = db;
    }

    getVideoSessions = async (req, res) => {
        try{
            const userId  = req.body.userId;

            const patientCollection = await this.db.getDB().collection('patients');
            const therapistCollection = await this.db.getDB().collection('therapists');
            const groupSessionsCollection = await this.db.getDB().collection('groupsessions');

            const therapist = await therapistCollection.findOne({_userId : userId });
            const patient = await patientCollection.findOne({_userId : userId });

            // if therapist requests the api end point
            if(therapist){
                const videoSessions = await groupSessionsCollection.find({ _therapistId: therapist._therapistId, _sessionType: 'video-chat'}, {
                    projection: {
                        _id: 0,
                        sessionId: "$_sessionId",
                        therapistId: "$_therapistId",
                        therapistName: "$_therapistName",
                        patientInfo: '$_patientInfo',
                        sessionTitle: "$_sessionTitle",
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
                const videoSessions = await groupSessionsCollection.find({ '_patientInfo.id': patient._patientId, _sessionType: 'video-chat'}, {
                    projection: {
                        _id: 0,
                        sessionId: "$_sessionId",
                        therapistId: "$_therapistId",
                        therapistName: "$_therapistName",
                        patientInfo: '$_patientInfo',
                        sessionTitle: "$_sessionTitle",
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

            const patientCollection = await this.db.getDB().collection('patients');
            const therapistCollection = await this.db.getDB().collection('therapists');
            const groupSessionsCollection = await this.db.getDB().collection('groupsessions');

            const therapist = await therapistCollection.findOne({_userId : userId });
            const patient = await patientCollection.findOne({_userId : userId });

            // if therapist requests the api end point
            if(therapist){
                const chatSessions = await groupSessionsCollection.find({ _therapistId: therapist._therapistId, _sessionType: 'text-chat'}, {
                    projection: {
                        _id: 0,
                        sessionId: "$_sessionId",
                        therapistId: "$_therapistId",
                        therapistName: "$_therapistName",
                        patientInfo: '$_patientInfo',
                        sessionTitle: "$_sessionTitle",
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
                const chatSessions = await groupSessionsCollection.find({ '_patientInfo.id': patient._patientId, _sessionType: 'text-chat'}, {
                    projection: {
                        _id: 0,
                        sessionId: "$_sessionId",
                        therapistId: "$_therapistId",
                        therapistName: "$_therapistName",
                        patientInfo: '$_patientInfo',
                        sessionTitle: "$_sessionTitle",
                        sessionType: "$_sessionType",
                        sessionStartTime: "$_sessionStartTime",
                        sessionEndTime: "$_sessionEndTime",  
                    }
                }).toArray();
                if (!chatSessions.length) return res.status(204).json({ 'message': 'No chatSessions found' });
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
    
            const groupSessionsCollection = await this.db.getDB().collection('groupsessions');
    
            const groupSession = await groupSessionsCollection.findOne({ _sessionId: req.params.id },{
                projection: {
                    _id: 0,
                    sessionId: "$_sessionId",
                    therapistId: "$_therapistId",
                    therapistName: "$_therapistName",
                    patientInfo: '$_patientInfo',
                    sessionTitle: "$_sessionTitle",
                    sessionType: "$_sessionType",
                    sessionStartTime: "$_sessionStartTime",
                    sessionEndTime: "$_sessionEndTime",  
                }
            })
    
            if (!groupSession) {
                return res.status(404).json({ message: 'groupSession not found' });
            }
    
            res.json(groupSession);    
        } catch (error) {
            console.error('Error fetching therapy session:', error);
            res.status(500).json({ 'message': 'Failed to fetch therapy session' });
        }
            }

    createVideoSessions = async (req, res) => {
        try{
            const groupSessionData = req.body;

            const therapistCollection = await this.db.getDB().collection('therapists');
            const groupSessionsCollection = await this.db.getDB().collection('groupsessions');

            //check if all required fields are there

    
            const therapist = await therapistCollection.findOne({_therapistId: groupSessionData.therapistId});

            //create an model object
            const groupSession = new GroupSession();

            groupSession.sessionId = uuidv4();
            groupSession.patientInfo = groupSessionData.patientInfo;
            groupSession.therapistId = groupSessionData.therapistId;
            groupSession.therapistName = therapist._name;
            groupSession.sessionTitle = groupSessionData.sessionTitle;
            groupSession.sessionType = 'video-chat';
            groupSession.sessionStartTime = groupSessionData.sessionStartTime;
            groupSession.sessionEndTime = null;

            await groupSessionsCollection.insertOne(groupSession);

        res.status(201).json({ 'message': 'therapy session(video) created successfully', 'groupSession': groupSession });
        } catch (error) {
            console.error('Error creating groupSession:', error);
            res.status(500).json({ 'message': 'Failed to create groupsession' });
        }

    }

    createTextSession = async (req, res) => {
        try{
            const groupSessionData = req.body;

            const therapistCollection = await this.db.getDB().collection('therapists');
            const groupSessionsCollection = await this.db.getDB().collection('groupsessions');

    
            const therapist = await therapistCollection.findOne({_therapistId: groupSessionData.therapistId});

            //create an model object
            const groupSession = new GroupSession();

            groupSession.sessionId = uuidv4();
            groupSession.patientInfo = groupSessionData.patientInfo;
            groupSession.therapistId = groupSessionData.therapistId;
            groupSession.therapistName = therapist._name;
            groupSession.sessionTitle = groupSessionData.sessionTitle;
            groupSession.sessionType = 'text-chat';
            groupSession.sessionStartTime = groupSessionData.sessionStartTime;
            console.log(groupSession)

            await groupSessionsCollection.insertOne(groupSession);

        res.status(201).json({ 'message': 'therapy session(text) created successfully', 'groupSession': groupSession });
        } catch (error) {
            console.error('Error creating groupSession:', error);
            res.status(500).json({ 'message': 'Failed to create groupsession' });
        }

    }

    removeParticipant = async (req, res) => {
        try {
            const { sessionId, participantId } = req.body;

            if (!sessionId || !participantId) {
                return res.status(400).json({ message: 'Session ID and Participant ID are required' });
            }

            const groupSessionsCollection = await this.db.getDB().collection('groupsessions');

            // Update the session to remove the participant
            const updateResult = await groupSessionsCollection.updateOne(
                { _sessionId: sessionId },
                { $pull: { 'patientInfo': { _patientId: participantId } }}
            );

            if (updateResult.modifiedCount === 0) {
                return res.status(404).json({ message: 'Session or participant not found' });
            }

            res.status(200).json({ message: 'Participant removed successfully' });
        } catch (error) {
            console.error('Error removing participant:', error);
            res.status(500).json({ message: 'Failed to remove participant' });
        }
    }
}

module.exports = GroupSessionController;