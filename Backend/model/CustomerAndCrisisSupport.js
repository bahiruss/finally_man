const User = require('./User');

class CustomerAndCrisisSupport extends User {
    constructor(customerSupportId){
        super();
        this._customerSupportId = customerSupportId;
        this._role = 'CustomerandCrisis';
    }

    get customerSupportId() {
        return this._customerSupportId;
    }

    set customerSupportId(customerSupportId) {
        this._customerSupportId = customerSupportId;
    }

    get role() {
        return this._role;
    }
}

module.exports = CustomerAndCrisisSupport;