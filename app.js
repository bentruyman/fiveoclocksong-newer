////////////////////////////////////////////////////////////////////////////////
// FIVEOCLOCKSONG
////////////////////////////////////////////////////////////////////////////////

var http = require('http');

var airport = require('airport'),
    seaport = require('seaport'),
    up = require('up'),
    _ = require('underscore');

var config = require('./config');

// create seaport server
var seaportServer = seaport.createServer();
seaportServer.listen(config.seaport.port);

// create and bind airport services
var ports = seaport.connect(config.seaport.port),
    services = ['messenger', 'poll', 'rdio', 'user'];

services.forEach(function (service) {
  var air = airport(ports),
      port;
  
  port = air(function () {
    this.service = require('./lib/services/' + service);
  });
  
  port.listen(service);
});

// start the poll manager
var pollManager = require('./lib/web/poll-manager');
pollManager.init();

// spin up the web servers
var master = http.Server().listen(config.server.port),
    srv = up(
      master,
      __dirname + '/lib/web/server',
      { numWorkers: config.server.workers }
    );
