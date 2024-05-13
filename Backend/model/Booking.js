class Booking {
    constructor(bookingId, patientId, patientName, therapistId, therapistName, date, timeSlot) {
        this._bookingId = bookingId;
        this._patientId = patientId;
        this._patientName = patientName;
        this._therapistName = therapistName
        this._therapistId = therapistId;
        this._date = date;
        this._timeSlot = timeSlot;
        this._isCanceled = false; 
        this._canceledBy = '';
    }
    get bookingId() {
        return this._bookingId;
    }
    
    set bookingId(bookingId) {
        this._bookingId = bookingId;
    }
    get patientId() {
        return this._patientId;
    }
    
    set patientId(patientId) {
        this._patientId = patientId;
    }

    get patientName() {
        return this._patientName;
    }

    set patientName(patientName) {
    this._patientName = patientName;
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