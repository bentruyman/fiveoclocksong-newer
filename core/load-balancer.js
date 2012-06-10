var http   = require('http'),
    os     = require('os'),
    path   = require('path'),
    up     = require('up'),
    config = require('../config').server;

var srv;

var LoadBalancer = module.exports = function () {
  this.master = http.Server();
};

LoadBalancer.prototype.start = function () {
  this.master.listen(config.port);
  
  this._srv = up(
    this.master,
    path.resolve(__dirname, '../server'),
    { numWorkers: config.workers || os.cpus().length }
  );
};

LoadBalancer.prototype.stop = function () {
  this.master.close();
};

LoadBalancer.prototype.reload = function () {
  this._srv.reload();
};
