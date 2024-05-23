const Message = require('../model/Message');
const { v4: uuidv4 } = require('uuid');

class MessageController {
    constructor (db) {
        this.db = db;
    }

    getMessages = async (req, res) => {
        try{
            const sessionId = req.body.sessionId;
            const { page = 1, limit = 10 } = req.query; // default just in case it is forgotten to be specified in the frontend

            const messageCollection = await this.db.getDB().collection('messages');

            // for the cursors
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            const messages = await messageCollection.find({ _sessionId: sessionId }, {
                projection: {
                    _id: 0,
                    messageId: "$_messageId", 
                    messageContent: "$_messageContent", 
                    sessionId: "$_sessionId", 
                    senderId: "$_senderId", 
                    timeStamp: "$_timeStamp",             
                }
            }).sort({ _timeStamp: -1}).skip(startIndex).limit(limit).toArray();
            
            if(!messages.length) return res.status(204).json({ message: 'No messages found' });
            res.json(messages);
        
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch messages' });
        }     
    }

    createMessage = async (req, res) => {
        try{
            const messageData = req.body;

            const messageCollection = await this.db.getDB().collection('messages');

            //check for missing fields
            if(!messageData.messageContent || !messageData.sessionId || !messageData.senderId) {
                return res.status(400).json({ message: 'Missing required fields! '});
            }

            const message = new Message();
            message.messageId = uuidv4();
            message.messageContent = messageData.messageContent;
            message.sessionId = messageData.sessionId;
            message.senderId = messageData.senderId;
            message.timeStamp = new Date();

            await messageCollection.insertOne(message);
            res.status(201).json({ message: 'message created successfully', 'createdMessage': message });
        } catch (error) {
            res.status(500).json({ message: 'Failed to create message'})
        }
    }

    updateMessage = async (req, res) => {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }
            const { messageContent } = req.body;
    
            if (!messageContent) {
                return res.status(400).json({ message: 'Message content is required for updating' });
            }
    
            const messageCollection = await this.db.getDB().collection('messages');
    
            const existingMessage = await messageCollection.findOne({ _messageId: req.params.id });
    
            if (!existingMessage) {
                return res.status(404).json({ message: 'Message not found' });
            }
    
            const result = await messageCollection.updateOne(
                { _messageId: req.params.id },
                { $set: { _messageContent: messageContent } }
            );
    
            res.json({ message: 'Message updated successfully', updatedMessage: result });
        } catch (error) {
            res.status(500).json({ message: 'Failed to update message' });
        }
    }
    

    deleteMessage = async (req, res) => {
        try{
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }

            const messageCollection = await this.db.getDB().collection('messages');

            await messageCollection.deleteOne({ _messageId: req.params.id });

        } catch (error) {
            res.status(500).json({ message: 'Failed to delete message' });
        }
    }

    getMessageById = async (req, res) => {
        try{
             
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }

            const message = await messageCollection.findOne({ _messageId: req.params.id }, {
                projection: {
                    _id: 0,
                    messageId: "$_messageId", 
                    messageContent: "$_messageContent", 
                    sessionId: "$_sessionId", 
                    senderId: "$_senderId", 
                    timeStamp: "$_timeStamp",             
                }
            })
            
            if (!message) {
                return res.status(404).json({ 'message': 'message not found' });
            }
            res.json(message);
        
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch message by id' });
        }
    }
}

module.exports = MessageController;
