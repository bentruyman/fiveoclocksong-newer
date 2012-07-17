////////////////////////////////////////////////////////////////////////////////
// FIVEOCLOCKSONG
////////////////////////////////////////////////////////////////////////////////

var LoadBalancer = require('./core/load-balancer'),
    PollManager = require('./core/poll-manager'),
    PollTimer = require('./core/poll-timer'),
    repl = require('./core/repl');

var app = {
  loadBalancer: new LoadBalancer,
  pollManager: new PollManager,
  pollTimer: new PollTimer
};

app.pollTimer.start();
app.pollManager.init(app.pollTimer);
app.loadBalancer.start();

repl.init();
