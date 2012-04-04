var faye   = require('faye'),
    config = require('../../config'),
    bayeux = new faye.NodeAdapter({ mount: '/' + config.messenger.mount });

bayeux.listen(config.messenger.port);

var messenger = module.exports = bayeux.getClient();
