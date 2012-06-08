var Q = require('q'),
    check = require('validator').check;

var config = require('../config'),
    db = require('../lib/db'),
    client = db.client;

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

Poll.prototype.getTracks = function (callback) {
  client.lrange(this._namespace + ':tracks', 0, -1,function (err, tracks) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, tracks);
    }
  });
};

Poll.prototype.addTrack = function (trackId, callback) {
  client.rpush(this._namespace + ':tracks', trackId, function (err, resp) {
    if (err) {
      callback(err);
    } else {
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

Poll.prototype.getVotes = function (callback) {
  client.hgetall(this._namespace + ':votes', function (err, allVotes) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, allVotes);
    }
  });
};

Poll.prototype.incrementVote = function (trackIndex, username, callback) {
  client.hincrby(this._namespace + ':votes:' + trackIndex, username, 1, function (err, resp) {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
};

Poll.prototype.decrementVote = function (trackIndex, username, callback) {
  client.hincrby(this._namespace + ':votes:' + trackIndex, username, -1, function (err, resp) {
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
  promises.push(Q.ncall(this.getVotes, this));
  
  Q.all(promises)
    .spread(function (tracks, votes) {
      callback(null, tracks, votes);
    })
    .fail(function (err) {
      callback(err, null, null);
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
  
  // pad month to two digits
  month = (month.length === 2) ? month : '0' + month;
  
  // pad day to two digits
  day = (day.length === 2) ? day : '0' + day;
  
  return '' + year + month + day;
};

Poll.findByDate = function (date, callback) {
  callback(null, Poll.create({ date: date }));
};

Poll.removeByDate = function (date) {
  return Poll.create(date).remove();
};
