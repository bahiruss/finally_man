const User = require('./User');

class Patient extends User {
    constructor(patientId){
        super();
        this._patientId = patientId;
        this._role = 'Patient'
    }

    get patientId() {
        return this._patientId;
    }

    set patientId(patientId) {
        this._patientId = patientId;
    }

    get role() {
        return this._role
    }
}

module.exports = Patient;