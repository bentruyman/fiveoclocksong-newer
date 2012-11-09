////////////////////////////////////////////////////////////////////////////////
// FIVEOCLOCKSONG - Master
////////////////////////////////////////////////////////////////////////////////

var http = require('http'),
    ss = require('socketstream'),
    config = require('./config'),
    server;

// use redis for pubsub transport
ss.publish.transport.use('redis', {
  host: config.redis.host,
  port: config.redis.port
});

// create the web server
server = http.Server(ss.http.middleware);
server.listen(4000);

// start socketstream
ss.start(server);
