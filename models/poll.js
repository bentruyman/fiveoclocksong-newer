var Q = require('q'),
    check = require('validator').check;

var config = require('../config'),
    logger = require('../core/log').getLogger('poll model'),
    Db = require('../lib/db'),
    client = new Db,
    rdio = require('../services/rdio');

var PREFIX = 'polls',
    DELETED = '__deleted__';

var Poll = module.exports = function (data) {
  check(data.date).len(8);
  
  this.date = data.date;
  this._namespace = PREFIX + ':' + this.date;
};

// public methods
Poll.prototype.save = function (callback) {
  callback(null);
};

Poll.prototype.remove = function (callback) {
  callback(null);
};

Poll.prototype.getTrackIds = function (callback) {
  logger.debug('retrieving track ids for poll: ' + this.date);
  
  client.lrange(this._namespace + ':tracks', 0, -1,function (err, ids) {
    if (err) {
      callback(err);
    } else {
      callback(null, ids);
    }
  });
};

Poll.prototype.getTracks = function (callback) {
  this.getTrackIds(function (err, ids) {
    rdio.getTrackData(ids, function (err, tracks) {
      if (err) {
        callback(err);
      } else {
        callback(null, tracks);
      }
    });
  });
};

Poll.prototype.addTrack = function (trackId, callback) {
  var self = this;
  
  logger.debug('adding track "' + trackId + '" to poll: ' + this.date);
  
  client.rpush(this._namespace + ':tracks', trackId, function (err, resp) {
    if (err) {
      logger.debug('failed to add track "' + trackId + '" to poll: ' + self.date);
      callback(err);
    } else {
      logger.debug('successfully added track "' + trackId + '" to poll: ' + self.date);
      callback(null);
    }
  });
};

Poll.prototype.removeTrack = function (index, callback) {
  var self = this,
      tracksKey = this._namespace + ':tracks',
      multi = client.multi(),
      i = 1 + index;
  
  // workaround for removing list items by index in redis
  client.llen(tracksKey, function (err, length) {
    if (err) {
      callback(err);
    } else {
      // remove the track from the tracks list
      multi
        .lset(tracksKey, index, DELETED)
        .lrem(tracksKey, 1, DELETED);
      
      // remove the track's voting data
      multi.del(self._namespace + ':votes:' + index);
      
      // reorder track voting data
      for (; i < length; i++) {
        if (i !== index) {
          multi.rename(self._namespace + ':votes:' + i, self._namespace + ':votes:' + (i - 1));
        }
      }
      
      multi.exec(function (err, replies) {
          if (err) {
            callback(err);
          } else {
            callback(null);
          }
        });
    }
  });
};

Poll.prototype.getTrackVotes = function (trackIndex, callback) {
  try {
    check(trackIndex).isInt();
  } catch (e) {
    return callback('Invalid arguments');
  }
  
  client.hgetall(this._namespace + ':votes:' + trackIndex, function (err, votes) {
    if (err) {
      callback(err);
    } else {
      callback(null, votes);
    }
  });
};

Poll.prototype.getAllVotes = function (callback) {
  var self = this,
      promises = [];
  
  this.getTrackIds(function (err, ids) {
    ids.forEach(function (id, index) {
      promises.push(Q.ncall(self.getTrackVotes, self, index));
    });
    
    Q.all(promises)
      .then(function (votes) {
        callback(null, votes);
      })
      .fail(
        function (err) {
          callback(err);
        }
    );
  });
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
  
  client.hincrby(this._namespace + ':votes:' + trackIndex, username, amount, function (err, resp) {
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
  
  client.hincrby(this._namespace + ':votes:' + trackIndex, username, -amount, function (err, resp) {
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

Poll.prototype.getTracksAndVotes = function (callback) {
  var promises = [];
  
  promises.push(Q.ncall(this.getTracks, this));
  promises.push(Q.ncall(this.getAllVotes, this));
  
  Q.all(promises)
    .then(function (results) {
      callback(null, results[0], results[1]);
    }, function (err) {
      callback(err);
    });
};

// private methods
Poll.prototype._setTracks = function (tracks, callback) {
  client.set(this._namespace + ':tracks', JSON.stringify(tracks), function (err, resp) {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
};

// static methods
Poll.create = function (data) {
  return new Poll(data);
};

Poll.createDateString = function (date) {
  date = new Date(date);
  
  var year  = date.getFullYear(),
      month = date.getMonth() + 1,
      day   = date.getDate();
  
  // stringify all the numbers
  year =   year.toString();
  month = month.toString();
  day =     day.toString();
  
  // pad month to two digits
  month = (month.length === 1) ? '0' + month : month;
  
  // pad day to two digits
  day = (day.length === 1) ? '0' + day : day;
  
  return '' + year + month + day;
};

Poll.findByDate = function (date, callback) {
  callback(null, Poll.create({ date: date }));
};

Poll.findTodays = function (callback) {
  Poll.findByDate(Poll.createDateString(new Date), callback);
};

Poll.removeByDate = function (date) {
  return Poll.create(date).remove();
};
