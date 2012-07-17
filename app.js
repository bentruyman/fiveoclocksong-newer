////////////////////////////////////////////////////////////////////////////////
// FIVEOCLOCKSONG
////////////////////////////////////////////////////////////////////////////////

var LoadBalancer = require('./core/load-balancer'),
    PollManager = require('./core/poll-manager'),
    repl = require('./core/repl');

var loadBalancer = new LoadBalancer,
    pollManager  = new PollManager;

pollManager.init();
loadBalancer.start();
repl.init();
