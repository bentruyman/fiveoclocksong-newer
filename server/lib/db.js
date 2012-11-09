var redis = require('redis'),
    config = require('../../config').redis,
    logger = require('../lib/logger').createLogger('db');

var DBClient = function (host, port) {
  logger.info('created redis client');
  return redis.createClient(port, host);
};

module.exports = {
  DBClient: DBClient,
  createClient: function (host, port) {
    return new DBClient(host, port);
  }
};
