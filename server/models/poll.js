var mongoose = require('mongoose'),
    Q = require('q'),
    check = require('validator').check;

var config = require('../../config'),
    namespace = require('../lib/util').namespace,
    logger = require('../lib/logger').createLogger('poll model'),
    mongoClient = require('../lib/mongodb').createClient(
      config.mongodb.host,
      config.mongodb.port,
      config.mongodb.db
    ),
    redisClient = require('../lib/redis').createClient(
      config.redis.host,
      config.redis.port
    ),
    rdio = require('../services/rdio');

var redisPrefix = config.redis.prefix;

function pad(num) {
  return (num.length === 1) ? '0' + num : '' + num;
}

var pollSchema = new mongoose.Schema({
  date:   { type: String, required: true, index: { unique: true } },
  tracks: Array
});

pollSchema.methods.getTrackVotes = function (trackIndex, callback) {
  logger.debug('getting vote count for track ' + trackIndex);
  
  try {
    check(trackIndex).isInt();
  } catch (e) {
    return callback('Invalid arguments');
  }
  
  redisClient.hgetall(namespace(redisPrefix, this.date, 'votes', trackIndex), function (err, resp) {
    if (err) {
      callback(err);
    } else {
      callback(null, resp);
    }
  });
};

pollSchema.methods.getAllVotes = function (callback) {
  
};

pollSchema.methods.incrementVote = function (username, trackId, amount, callback) {
  logger.debug('incrementing vote by ' + amount + ' on track #' + trackIndex + ' for user "' + username + '"');
  
  try {
    check(username).isAlphanumeric();
    check(trackIndex).isInt();
    check(amount).isInt();
  } catch (e) {
    return callback('Invalid arguments');
  }
  
  redisClient.hincrby(namespace(redisPrefix, this.date, 'votes', trackIndex), username, amount, function (err, resp) {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
};

pollSchema.methods.decrementVote = function (username, trackId, amount, callback) {
  logger.debug('decrementing vote by ' + amount + ' on track #' + trackIndex + ' for user "' + username + '"');
  
  try {
    check(username).isAlphanumeric();
    check(trackIndex).isInt();
    check(amount).isInt();
  } catch (e) {
    return callback('Invalid arguments');
  }
  
  redisClient.hincrby(namespace(redisPrefix, this.date, 'votes', trackIndex), username, -amount, function (err, resp) {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
};

pollSchema.methods.populateTracks = function (limit, callback) {
  var self = this;
  
  if (!callback) {
    callback = limit;
    limit = config.app.tracksPerPoll;
  }
  
  // retrieve and pick a set of random tracks
  rdio.getTrackIdsFromPlaylist(config.rdio.playlistId, function (err, tracks) {
    var newTracks = [];
    
    if (err) {
      return callback(err);
    }
    
    // TODO: Implement solution to exclude tracks from recent previous polls
    while (newTracks.length < limit) {
      newTracks.push(tracks.splice(Math.floor(Math.random() * tracks.length), 1)[0]);
    }
    
    self.tracks = newTracks;
    
    callback(null, newTracks);
  });
};

pollSchema.statics.createDateString = function (d) {
  d = d || new Date;
  
  return [ d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate()) ].join('');
};

pollSchema.statics.today = function () {
  return pollSchema.statics.createDateString(new Date);
}

module.exports = mongoClient.model('Poll', pollSchema);
