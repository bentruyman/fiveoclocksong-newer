var log4js = require('log4js');
log4js.loadAppender('console');

var getLogger = log4js.getLogger;

log4js.getLogger = function (name) {
  return getLogger(process.pid + ' ' + name);
};

module.exports = log4js;
