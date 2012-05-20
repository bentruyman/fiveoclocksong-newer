var http   = require('http'),
    path   = require('path'),
    up     = require('up'),
    config = require('../config').server;

var srv;

var loadBalancer = module.exports = {
  master: http.Server(),
  start: function () {
    loadBalancer.master.listen(config.port);
    
    srv = up(
      loadBalancer.master,
      path.resolve(__dirname, '../app/server'),
      { numWorkers: config.workers }
    );
  },
  stop: function () {
    loadBalancer.master.close();
  },
  reload: function () {
    srv.reload();
  }
};
