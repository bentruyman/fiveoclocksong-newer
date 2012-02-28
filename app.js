////////////////////////////////////////////////////////////////////////////////
// FIVEOCLOCKSONG
////////////////////////////////////////////////////////////////////////////////
var config = require('./config');

var http = require('http'),
    up = require('up'),
    master = http.Server().listen(config.server.port);

// initialize up
var srv = up(master, __dirname + '/lib/fiveoclocksong/web/app');

// reload on SIGUSR2
process.on('SIGUSR2', function () {
  srv.reload();
});

// init the poll manager
var PollManager = require('./lib/fiveoclocksong/web/poll-manager');
PollManager.init();
