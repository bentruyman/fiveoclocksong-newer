////////////////////////////////////////////////////////////////////////////////
// FIVEOCLOCKSONG
////////////////////////////////////////////////////////////////////////////////
var config = require('./config');

// initialize up
var app = require('./lib/fiveoclocksong/web/app');

// init the poll manager
var PollManager = require('./lib/fiveoclocksong/web/poll-manager');
PollManager.init();

app.listen(config.server.port);
