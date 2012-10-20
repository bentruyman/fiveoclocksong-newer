var redis = require('redis'),
    config = require('../../config').redis,
    logger = require('../lib/logger').createLogger('db');

module.exports = {
  createClient: function () {
    logger.info('created redis client');
    return redis.createClient(config.port, config.host);
  }
};
