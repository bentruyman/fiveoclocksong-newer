var faye   = require('faye'),
    redis  = require('faye-redis'),
    config = require('../config'),
    logger = require('../core/log').getLogger('messenger');

var Messenger = module.exports = function () {
  logger.info('created faye node adapter');
  return new faye.NodeAdapter({
    mount: '/' + config.messenger.mount,
    engine: {
      type: redis,
      host: config.redis.host,
      port: config.redis.port,
      namespace: config.redis.namespace
    }
  });
};
