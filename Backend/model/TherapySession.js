class TherapySession {
    constructor(sessionId, therapistId, therapistName, patientInfo, sessionType, sessionStartTime, sessionEndTime)
    {
        this._sessionId = sessionId;
        this._therapistId = therapistId;
        this._patientInfo = patientInfo;
        this._therapistName = therapistName;
        this._sessionType = sessionType;
        this._sessionStartTime = sessionStartTime;
        this._sessionEndTime = sessionEndTime
    }

    get sessionId() {
        return this._sessionId;
    }

    set sessionId(sessionId) {
        this._sessionId = sessionId;
    }

    get therapistName() {
        return this._therapistName;
    }

    set therapistName(therapistName) {
    this._therapistName = therapistName;
    }

    get therapistId() {
        return this._therapistId;
    }

    set therapistId(therapistId) {
        this._therapistId = therapistId;
    }

    get patientInfo() {
        return this._patientInfo;
    }

    set patientInfo(patientInfo) {
    this._patientInfo = patientInfo;
    }

    get sessionType() {
        return this._sessionType;
    }

    set sessionType(sessionType) {
        this._sessionType = sessionType;
    }

    get sessionStartTime() {
        return this._sessionStartTime;
    }

    set sessionStartTime(sessionStartTime) {
        this._sessionStartTime = sessionStartTime;
    }

    get sessionEndTime() {
        return this._sessionEndTime;
    }

    set sessionEndTime(sessionEndTime) {
        this._sessionEndTime = sessionEndTime;
    }
}

module.exports = TherapySession;