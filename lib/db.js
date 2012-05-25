var redis = require('redis'),
    config = require('../config').redis;

var Database = module.exports = function () {
  return redis.createClient(config.port, config.host);
};
