var http   = require('http'),
    os     = require('os'),
    path   = require('path'),
    up     = require('up'),
    config = require('../config').server,
    logger = require('./log').getLogger('load balancer');

var srv;

var LoadBalancer = module.exports = function () {
  logger.info('created server');
  this.master = http.Server();
};

LoadBalancer.prototype.start = function () {
  this.master.listen(config.port);
  
  logger.info('started');
  this._srv = up(
    this.master,
    path.resolve(__dirname, '../server'),
    { numWorkers: config.workers || os.cpus().length }
  );
};

LoadBalancer.prototype.stop = function () {
  logger.info('stopped');
  this.master.close();
};

LoadBalancer.prototype.reload = function () {
  logger.info('reloaded');
  this._srv.reload();
};
