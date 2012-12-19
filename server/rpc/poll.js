var Q = require('q');

var Poll = require('../models/poll'),
    rdio = require('../services/rdio');

module.exports.actions = function (req, res, ss) {
  req.use('session');
  
  function getPoll(dateString, callback) {
    Poll.findOne({ date: dateString }, function (err, poll) {
      if (err) {
        callback(err);
      } else if (poll === null) {
        callback(null, null);
      } else {
        rdio.getTrackData(poll.tracks, function (err, data) {
          if (err) {
            callback(err);
          } else {
            poll.tracks = data;
            
            poll.getAllVotes(function (err, votes) {
              if (err) {
                callback(err);
              } else {
                callback(null, {
                  poll: poll,
                  votes: votes
                });
              }
            });
          }
        });
      }
    });
  }
  
  function getTodays(callback) {
    getPoll(Poll.today(), callback);
  }
  
  var rpc = {
    get: function (dateString) {
      getPoll(function (err, data) {
        res(data);
      });
    },
    upvote: function (trackIndex) {
      var poll = new Poll({ date: Poll.today() });
      
      if ('username' in req.session) {
        poll.incrementVote(req.session.username, trackIndex, 1, function (err) {
          if (err) {
            res(false);
          } else {
            ss.publish.all('/poll/upvote', trackIndex);
            res(true);
          }
        });
      }
    },
    downvote: function (trackIndex) {
      var poll = new Poll({ date: Poll.today() });
      
      if ('username' in req.session) {
        poll.decrementVote(req.session.username, trackIndex, 1, function (err) {
          if (err) {
            res(false);
          } else {
            ss.publish.all('/poll/upvote', trackIndex);
            res(true);
          }
        });
      }
    },
    today: function () {
      getPoll(Poll.today(), function (err, data) {
        if (err) {
          res(false);
        } else {
          res(data);
        }
      });
    }
  };
  
  return rpc;
};
