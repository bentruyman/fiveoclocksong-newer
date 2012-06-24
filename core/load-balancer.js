var http = require('http'),
    os   = require('os'),
    path = require('path');

var airport = require('airport'),
    up = require('up');

var config = require('../config'),
    logger = require('../shared/log').getLogger('load balancer');

var air = airport(config.server.host, config.seaport.port),
    upped = false;

var master = http.Server(),
    srv;
logger.info('created server');

air(function (remote, conn) {
  this.start = function () {
    try {
      master.listen(config.server.port);
    } catch (e) {
      logger.error(e);
    }
    
    if (upped === false) {
      srv = up(
        master,
        path.resolve(__dirname, '../server'),
        { numWorkers: config.server.workers || os.cpus().length }
      );
      upped = true;
    }
    
    logger.info('started');
  };

  this.stop = function () {
    try {
      master.close();
    } catch (e) {
      logger.error(e);
    }
    
    logger.info('stopped');
  };

  this.reload = function () {
    try {
      srv.reload();
    } catch (e) {
      logger.error(e);
    }
    
    logger.info('reloaded');
  };
}).listen('load balancer');
