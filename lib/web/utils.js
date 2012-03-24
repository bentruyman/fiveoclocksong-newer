var airport = require('airport'),
    Q       = require('q'),
    seaport = require('seaport');

var config = require('../../config');

var utils = module.exports = {
  getDeferredServices: (function () {
    var ports = seaport.connect(config.seaport.port),
        air = airport(ports);
    
    return function (services) {
      var promises = services.map(function (service) {
        var up = air.connect(service),
            deferred = Q.defer();
        
        up(function (remote) {
          deferred.resolve(remote);
        });
        
        return deferred.promise;
      });
      
      return Q.all(promises);
    };
  }())
};
