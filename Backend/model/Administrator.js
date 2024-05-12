const User = require('./User');

class Administrator extends User {
    constructor(adminId){
        super();
        this._adminId = adminId;
        this._role = 'Admin';
    }

    get adminId() {
        return this._adminId;
    }

    set adminId(adminId) {
        this._adminId = adminId;
    }

    get role() {
        return this._role;
    }
}

module.exports = Administrator;