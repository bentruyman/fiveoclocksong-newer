var http   = require('http'),
    os     = require('os'),
    path   = require('path'),
    up     = require('up'),
    config = require('../config').server,
    logger = require('./log').getLogger('load balancer');

var upped = false;

var LoadBalancer = module.exports = function () {
  logger.info('created server');
  this.master = http.Server();
};

LoadBalancer.prototype.start = function () {
  try {
    this.master.listen(config.port);
  } catch (e) {}
  
  if (upped === false) {
    this._srv = up(
      this.master,
      path.resolve(__dirname, '../server'),
      { numWorkers: config.workers || os.cpus().length }
    );
    upped = true;
  }
  
  logger.info('started');
};

LoadBalancer.prototype.stop = function () {
  try {
    this.master.close();
  } catch (e) {}
  
  logger.info('stopped');
};

LoadBalancer.prototype.reload = function () {
  try {
    this._srv.reload();
  } catch (e) {}
  
  logger.info('reloaded');
};
