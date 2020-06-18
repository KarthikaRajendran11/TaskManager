const logger = require('loglevel');
const config = require('../util/config');

const log = {

    getLogger : (module) => {
        logger.setLevel(`${config.get('logging:level')}`);
        return logger.getLogger(module);
    }
}

module.exports = log;