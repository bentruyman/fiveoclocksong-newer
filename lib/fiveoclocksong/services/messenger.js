var faye   = require('faye'),
    config = require('../../../config'),
    bayeux;

var messenger = module.exports = {
  init: function () {
    bayeux = new faye.NodeAdapter({ mount: config.messenger.mount, timeout: 45 });
    messenger.client = bayeux.getClient();
  },
  attach: function (server) {
    bayeux.attach(server);
  },
  client: null
};
