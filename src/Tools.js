const { isError } = require('./Is');

class Tools {
    constructor() {
        //
    }
    formatError(err, options = {}) {
        let { beautifyJSON } = options;
        
        if (isError(err)) {
            return err.stack + '';
        } else {
            return JSON.stringify(err, null, beautifyJSON ? 4 : '');
        }
    }
    notEmpty(n) {
        return n !== undefined && n !== null && n !== '';
    }
}

let tools = new Tools();
module.exports = tools;