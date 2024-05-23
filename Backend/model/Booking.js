class Booking {
    constructor(bookingId, patientInfo, therapistId, therapistName, date, timeSlot, sessionType, sessionMode, sessionTitle, sessionLocation) {
        this._bookingId = bookingId;
        this._patientInfo = patientInfo;
        this._therapistName = therapistName
        this._therapistId = therapistId;
        this._sessionTitle = sessionTitle;
        this._date = date;
        this._timeSlot = timeSlot;
        this._sessionType = sessionType;
        this._sessionMode = sessionMode;
        this._sessionLocation = sessionLocation;
        this._isCanceled = false; 
        this._canceledBy = '';
    }
    get bookingId() {
        return this._bookingId;
    }
    
    set bookingId(bookingId) {
        this._bookingId = bookingId;
    }

    get patientInfo() {
        return this._patientInfo;
    }

    set patientInfo(patientInfo) {
    this._patientInfo = patientInfo;
    }

    get therapistId() {
        return this._therapistId;
    }

    set therapistId(therapistId) {
        this._therapistId = therapistId;
    }

    get therapistName() {
        return this._therapistName;
    }

    set therapistName(therapistName) {
        this._therapistName = therapistName;
    }

    get sessionTitle() {
        return this._sessionTitle;
    }

    set sessionTitle(sessionTitle) {
        this._sessionTitle = sessionTitle;
    }

    get date() {
        return this._date;
    }

    set date(date) {
        this._date = date;
    }

    get timeSlot(){
        return this._timeSlot;
    } 

    set timeSlot(timeSlot) {
        this._timeSlot = timeSlot;
    }

    get sessionType() {
        return this._sessionType;
    }

    set sessionType(sessionType) {
        this._sessionType = sessionType;
    }

    get sessionMode() {
        return this._sessionMode;
    }

    set sessionMode(sessionMode) {
        this._sessionMode = sessionMode;
    }

    get sessionLocation() {
        return this._sessionLocation;
    }

    set sessionLocation(sessionLocation) {
        this._sessionLocation = sessionLocation;
    }


    get isCanceled() {
        return this._isCanceled;
    }

    set isCanceled(isCanceled) {
    this._isCanceled = isCanceled;
    }

    get canceledBy() {
    return this._canceledBy;
    }

    set canceledBy(canceledBy) {
    this._canceledBy = canceledBy;
    }  
    
}

module.exports = Booking;