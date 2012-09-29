////////////////////////////////////////////////////////////////////////////////
// FIVEOCLOCKSONG
////////////////////////////////////////////////////////////////////////////////

var CompassCompiler = require('./core/compass-compiler'),
    LoadBalancer = require('./core/load-balancer'),
    PollManager = require('./core/poll-manager'),
    repl = require('./core/repl');

var compassCompiler = new CompassCompiler,
    loadBalancer    = new LoadBalancer,
    pollManager     = new PollManager;

compassCompiler.init();
pollManager.init();
loadBalancer.start();
repl.init();
