class FeedbackAndRating {
    constructor(feedbackId, raterId, raterName, therapistId, rating, comment, timeStamp) {
        this._feedbackId = feedbackId;
        this._raterId = raterId;
        this._raterName = raterName
        this._therapistId = therapistId;
        this._rating = rating;
        this._comment = comment;
        this._timeStamp = timeStamp
    }

    get feedbackId() {
        return this._feedbackId;
    }

    get raterId() {
        return this._raterId;
    }

    get raterName() {
        return this._raterName;
    }

    get therapistId() {
        return this._therapistId;
    }

    get rating() {
        return this._rating;
    }

    get comment() {
        return this._comment;
    }

    get timeStamp() {
        return this._timeStamp;
    }

    set feedbackId(feedbackId) {
        this._feedbackId = feedbackId;
    }

    set raterId(raterId) {
        this._raterId = raterId;
    }

    set raterName(raterName) {
        this._raterName = raterName;
    }

    set therapistId(therapistId) {
        this._therapistId = therapistId;
    }

    set rating(rating) {
        this._rating = rating;
    }

    set comment(comment) {
        this._comment = comment;
    }

    set timeStamp(timeStamp) {
        this._timeStamp = timeStamp;
    }
}

module.exports = FeedbackAndRating;