var log4js = require('log4js');
log4js.loadAppender('console');

module.exports = {
  createLogger: function (name) {
    return log4js.getLogger(process.pid + ' ' + name);
  }
};
