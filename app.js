////////////////////////////////////////////////////////////////////////////////
// FIVEOCLOCKSONG
////////////////////////////////////////////////////////////////////////////////

var airport = require('airport'),
    seaport = require('seaport');

var config = require('./config'),
    repl = require('./core/repl');

require('./core/load-balancer');
require('./core/poll-manager');
require('./core/repl');

seaport.createServer().listen(config.seaport.port);

var air = airport(config.server.host, config.seaport.port);

air.connect('load balancer', function (loadBalancer) {
  loadBalancer.start();
});

air.connect('poll manager', function (pollManager) {
  pollManager.init();
});
