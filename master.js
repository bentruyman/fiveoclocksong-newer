////////////////////////////////////////////////////////////////////////////////
// FIVEOCLOCKSONG - Master
////////////////////////////////////////////////////////////////////////////////

var http = require('http'),
    ss = require('socketstream'),
    config = require('./config'),
    pollService = require('./server/services/poll'),
    pollTimer = require('./server/lib/poll-timer').createTimer(),
    server;

// use redis for pubsub transport
ss.publish.transport.use('redis', {
  host: config.redis.host,
  port: config.redis.port
});

// start the poll timer
pollTimer.start();

// check to see if today's poll already exists
pollService.getTodaysPoll(function (err, poll) {
  // if the poll doesn't exist, create it
  if (poll.tracks.length === 0) {
    pollService.createTodaysPoll(function (err, poll) {
      if (err) {
        throw err;
      }
    });
  }
});

// let all clients know when a new poll starts
pollTimer.on('pollstart', function () {
  pollService.createTodaysPoll(function (err, poll) {
    if (err) {
      throw err;
    } else {
      ss.api.publish.all('/poll/start', poll);
    }
  });
});

// let all clients know when a new poll stops
pollTimer.on('pollstop', function () {
  ss.api.publish.all('/poll/stop');
});

// create the web server
server = http.Server(ss.http.middleware);
server.listen(4000);

// start socketstream
ss.start(server);
