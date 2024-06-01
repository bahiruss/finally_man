const SessionNote = require('../model/SessionNote');
const { v4: uuidv4 } = require('uuid');

class SessionNoteController {
    constructor(db) {
        this.db = db;
    }

    async getNotes (req, res) {
        try{
            if (!req?.params?.sessionId) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }

            const sessionNoteCollection = await this.db.getDB().collection('notes');

            const sessionNotes = await sessionNoteCollection.find({ _sessionId: req.params.sessionId }, {
                projection: {
                    _id: 0,
                    noteId: "$_noteId",
                    sessionId: "$_sessionId",
                    note: "$_note", 
                    creatorId: "$_creatorId", 
                    timeStamp: "$_timeStamp",
                }
            }).toArray();
    
            if(!sessionNotes.length) return res.status(204).json({ message: 'No notes found' });

            res.json(sessionNotes);

        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch notes' });
        }
       
    }

    async getNoteById (req, res) {
        try{
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }

            const sessionNoteCollection = await this.db.getDB().collection('notes');

            const sessionNote = await sessionNoteCollection.findOne({ _noteId: req.params.id }, {
                projection: {
                    _id: 0,
                    noteId: "$_noteId",
                    sessionId: "$_sessionId",
                    note: "$_note", 
                    creatorId: "$_creatorId", 
                    timeStamp: "$_timeStamp",
                }
            });
    
            if(!sessionNote) return res.status(404).json({ message: 'Session Note not found' });

            res.json(sessionNote);

        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch note' });
        }
    
    }

    async createNote (req, res) {
        try {
            const noteData = req.body;

            const sessionNoteCollection = await this.db.getDB().collection('notes');

            //check for missing fields  // decide whether the note taking will only be for therapist or patient
            if( !noteData.sessionId || !noteData.creatorId || !noteData.note) {
                return res.status(400).json({ message: 'Missing required fields! '})
            }

            const sessionNote = new SessionNote();
            
            sessionNote.noteId =  uuidv4();
            sessionNote.sessionId = noteData.sessionId;
            sessionNote.note = noteData.note;
            sessionNote.creatorId = noteData.userId;
            sessionNote.timeStamp = new Date();

            //insert in database
            await sessionNoteCollection.insertOne(sessionNote);
            res.status(201).json({ message: 'Note created successfully', 'createdNote': sessionNote });

        } catch (error) {
            res.status(500).json({ message: 'Failed to create note'});
        }
    }

    async updateNote (req, res) {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }

            const noteData = req.body;

            const sessionNoteCollection = await this.db.getDB().collection('notes');

            const existingNote = await sessionNoteCollection.findOne({ _noteId: req.params.id });

            if(!existingNote) {
                return res.status(404).json({ message: 'Note not found'});
            }

            const updatedNote = await sessionNoteCollection.updateOne(
                { _noteId: req.params.id },
                { $set: { _note: noteData.note}}
            );

            res.json({ message: 'Note updated successfully', updatedNote: updatedNote });

        } catch (error) {
            res.status(500).json({ message: 'Failed to update note' });
        }
    }

    async deleteNote (req, res) {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }
            
            const sessionNoteCollection = await this.db.getDB().collection('notes');

            const existingNote = await sessionNoteCollection.findOne({ _noteId: req.params.id });

            if(!existingNote) {
                return res.status(404).json({ message: 'Note not found'});
            }

            await sessionNoteCollection.deleteOne({ _noteId: req.params.id });

            res.json({ message: 'Note deleted successfully' });

        } catch (error) {
            res.status(500).json({ message: 'Failed to delete note' });
        }
    }
}

module.exports = SessionNoteController;