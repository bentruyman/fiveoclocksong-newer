var redis = require('redis'),
    config = require('../config').redis,
    logger = require('../core/log').getLogger('db');

var Database = module.exports = function () {
  logger.info('created redis client');
  return redis.createClient(config.port, config.host);
};
