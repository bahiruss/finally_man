class Schedule {
    constructor(scheduleId, therapistId, oneOnOneAvailability, groupAvailability){
        this._scheduleId = scheduleId;
        this._therapistId = therapistId;
        this._oneOnOneAvailability = oneOnOneAvailability;
        this._groupAvailability = groupAvailability;
    } 
    
    get scheduleId() {
        return this._scheduleId;
    }

    set scheduleId(scheduleId) {
        this._scheduleId = scheduleId;
    }

    get therapistId() {
        return this._therapistId;
    }

    set therapistId(therapistId) {
        this._therapistId = therapistId;
    }

    get oneOnOneAvailability() {
        return this._oneOnOneAvailability;
    }

    set oneOnOneAvailability(oneOnOneAvailability) {
        this._oneOnOneAvailability = oneOnOneAvailability;
    }

    get groupAvailability() {
        return this._groupAvailability;
    }

    set groupAvailability(groupAvailability) {
        this._groupAvailability =groupAvailability;
    }
}

module.exports = Schedule;