////////////////////////////////////////////////////////////////////////////////
// FIVEOCLOCKSONG
////////////////////////////////////////////////////////////////////////////////

// initialize the service registry
var serviceRegistry = require('./core/service-registry');
serviceRegistry.init();

// register the shared services
['messenger', 'poll', 'rdio', 'user'].forEach(function (name) {
  serviceRegistry.set(name, require('./shared/' + name));
});

// initialize the poll manager
var pollManager = require('./core/poll-manager');
pollManager.init();

// spin up the web servers
var loadBalancer = require('./core/load-balancer');
loadBalancer.start();
