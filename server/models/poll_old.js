var Q = require('q'),
    check = require('validator').check;

var config = require('../../config'),
    logger = require('../lib/logger').createLogger('poll model'),
    redisClient = require('../lib/db').createClient(config.redis.host, config.redis.port),
    rdio = require('../services/rdio');

var PREFIX = 'polls';

// public methods
Poll.prototype.getTrackVotes = function (trackIndex, callback) {
  
};

Poll.prototype.getAllVotes = function (callback) {
  
};

Poll.prototype.incrementVote = function (username, trackIndex, amount, callback) {
  logger.debug('incrementing vote by ' + amount + ' on track #' + trackIndex + ' for user "' + username + '"');
  
  try {
    check(username).isAlphanumeric();
    check(trackIndex).isInt();
    check(amount).isInt();
  } catch (e) {
    return callback('Invalid arguments');
  }
  
  redisClient.hincrby(this._namespace + ':votes:' + trackIndex, username, amount, function (err, resp) {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
};

Poll.prototype.decrementVote = function (username, trackIndex, amount, callback) {
  logger.debug('decrementing vote by ' + amount + ' on track #' + trackIndex + ' for user "' + username + '"');
  
  try {
    check(username).isAlphanumeric();
    check(trackIndex).isInt();
    check(amount).isInt();
  } catch (e) {
    return callback('Invalid arguments');
  }
  
  redisClient.hincrby(this._namespace + ':votes:' + trackIndex, username, -amount, function (err, resp) {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
};

Poll.prototype.toJSON = function () {
  return {};
};
