var log4js = require('log4js');
log4js.loadAppender('console');

var Logger = function (name) {
  return log4js.getLogger(process.pid + ' ' + name);
};

module.exports = {
  Logger: Logger,
  createLogger: function (name) {
    return new Logger(name);
  }
};
