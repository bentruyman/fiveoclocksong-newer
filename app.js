////////////////////////////////////////////////////////////////////////////////
// FIVEOCLOCKSONG
////////////////////////////////////////////////////////////////////////////////

var LoadBalancer = require('./core/load-balancer'),
    PollManager = require('./core/poll-manager');

var App = module.exports = {
  loadBalancer: new LoadBalancer,
  pollManager: new PollManager
};

App.pollManager.init();
App.loadBalancer.start();
