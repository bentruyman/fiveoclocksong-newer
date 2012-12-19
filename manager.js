////////////////////////////////////////////////////////////////////////////////
// FIVEOCLOCKSONG - Manager
////////////////////////////////////////////////////////////////////////////////

var http = require('http'),
    ss = require('socketstream'),
    config = require('./config'),
    Poll = require('./server/models/poll'),
    pollTimer = require('./server/lib/poll-timer').createTimer(),
    consoleServer, server;

// use redis for pubsub transport
ss.publish.transport.use('redis', {
  host: config.redis.host,
  port: config.redis.port
});

// start the poll timer
pollTimer.start();

// check to see if today's poll already exists
Poll.findOne({ date: Poll.today() }, function (err, poll) {
  if (poll === null) {
    poll = new Poll({ date: Poll.today() });
    poll.populateTracks(function (err, tracks) {
      poll.save(function (err, resp) {
        if (err) {
          throw err;
        }
      });
    });
  }
});

// let all clients know when a new poll starts
pollTimer.on('pollstart', function () {
  var poll = new Poll({ date: Poll.today() });
  
  poll.populateTracks(function (err, tracks) {
    poll.save(function (err, resp) {
      if (err) {
        throw err;
      } else {
        ss.api.publish.all('/poll/start', poll);
      }
    });
  });
});

// let all clients know when a new poll stops
pollTimer.on('pollstop', function () {
  ss.api.publish.all('/poll/stop');
});

// create the console server
consoleServer = require('ss-console')(ss);
consoleServer.listen(config.repl.port);

// create the web server
server = http.Server(ss.http.middleware);
server.listen(parseInt(process.argv.slice(-1), 10));

// start socketstream
ss.start(server);
