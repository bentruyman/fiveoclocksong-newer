var airport = require('airport'),
    seaport = require('seaport'),
    Q = require('q'),
    up = require('up');

var config = require('../config');

// create seaport server
var seaportServer = seaport.createServer();

var serviceRegistry = module.exports = {
  init: function () {
    seaportServer.listen(config.seaport.port);
  },
  get: function (serviceNames, callback) {
    var air = getAir(),
        promises;
    
    // if a string is passed in, normalize it to an array
    if (!Array.isArray(serviceNames)) {
      serviceNames = [serviceNames];
    }
    
    promises = serviceNames.map(function (name) {
      var up = air.connect(name),
          deferred = Q.defer();
      
      up(function (remote) {
        deferred.resolve(remote.service);
      });
      
      return deferred.promise;
    });
    
    Q.all(promises).spread(callback);
  },
  set: function (name, service) {
    getAir()(function () { this.service = service; }).listen(name);
  }
};

function getAir () {
  var ports = seaport.connect('localhost', config.seaport.port);
  return airport(ports);
}
