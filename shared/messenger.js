var faye   = require('faye'),
    config = require('../config'),
    bayeux = new faye.NodeAdapter({ mount: '/' + config.messenger.mount }),
    client;

bayeux.listen(config.messenger.port);
client = bayeux.getClient();

var messenger = module.exports = {};

['publish', 'subscribe'].forEach(function (method) {
  messenger[method] = client[method].bind(client);
});
