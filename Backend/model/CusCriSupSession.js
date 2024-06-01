class CusCriSupSession {
    constructor(sessionId, customerSupportId, customerSupportEmpName, userId, supportType, supportTimeStamp) {
        this._sessionId = sessionId;
        this._customerSupportId = customerSupportId;
        this._customerSupportEmpName = customerSupportEmpName;
        this._userId = userId;
        this._supportType = supportType;
        this._supportTimeStamp = supportTimeStamp;
    }

    get sessionId() {
        return this._sessionId;
    }

    set sessionId(sessionId) {
        this._sessionId = sessionId;
    }

    get customerSupportId() {
        return this._customerSupportId;
    }

    set customerSupportId(customerSupportId) {
        this._customerSupportId = customerSupportId;
    }

    get customerSupportEmpName() {
        return this._customerSupportEmpName;
    }

    set customerSupportEmpName(customerSupportEmpName) {
        this._customerSupportEmpName = customerSupportEmpName;
    }

    get userId() {
        return this._userId;
    }

    set userId(userId) {
        this._userId = userId;
    }

    get supportType() {
        return this._supportType;
    }

    set supportType(supportType) {
        this._supportType = supportType;
    }

    get supportTimeStamp() {
        return this._supportTimeStamp;
    }

    set supportTimeStamp(supportTimeStamp) {
        this._supportTimeStamp = supportTimeStamp;
    }
}

module.exports = CusCriSupSession;
