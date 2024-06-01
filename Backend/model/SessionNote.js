class SessionNote {
    constructor(sessionId, note, creatorId, timeStamp, noteId){
        this._noteId = noteId
        this._sessionId = sessionId;
        this._note = note;
        this._creatorId = creatorId;
        this._timeStamp = timeStamp;
    }

    get noteId() {
        return this._noteId;
    }

    set noteId(noteId) {
        this._noteId = noteId;
    }
    
    get sessionId() {
        return this._sessionId;
    }

    set sessionId(sessionId) {
        this._sessionId = sessionId;
    }

    get note() {
        return this._note;
    }

    set note(note) {
        this._note = note;
    }

    get creatorId() {
        return this._creatorId;
    }

    set creatorId(creatorId) {
        this._creatorId = creatorId;
    }

    get timeStamp() {
        return this._timeStamp;
    }

    set timeStamp(timeStamp) {
        this._timeStamp = timeStamp;
    }
}

module.exports = SessionNote;