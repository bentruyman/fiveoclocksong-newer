var faye   = require('faye'),
    redis  = require('faye-redis'),
    config = require('../config'),
    logger = require('../core/log').getLogger('messenger');

module.exports = {
  createMessenger: function () {
    logger.info('created faye node adapter');
    return new faye.NodeAdapter({
      mount: '/' + config.messenger.mount,
      engine: {
        type: redis,
        host: config.redis.host,
        port: config.redis.port,
        namespace: 'pubsub'
      }
    });
  }
};
