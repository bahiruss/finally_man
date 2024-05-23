const TherapySession = require('./TherapySession')

class GroupSession extends TherapySession {
    constructor(sessionTitle) {
        super();
        this._sessionTitle = sessionTitle;
    }
    get sessionTitle() {
        return this._sessionTitle;
    }

    set sessionTitle(sessionTitle) {
        this._sessionTitle = sessionTitle;
    }
}

module.exports = GroupSession;