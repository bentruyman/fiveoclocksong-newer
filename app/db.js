var redis = require('redis'),
    config = require('../config').redis;

module.exports = {
  client: redis.createClient(config.port, config.host)
};
