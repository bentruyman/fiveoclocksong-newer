var faye   = require('faye'),
    redis  = require('faye-redis'),
    config = require('../config');

var Messenger = module.exports = function () {
  return new faye.NodeAdapter({
    mount: '/' + config.messenger.mount,
    engine: {
      type: redis,
      host: config.redis.host,
      port: config.redis.port,
      namespace: 'pubsub'
    }
  });
};
