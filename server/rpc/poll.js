var Poll = require('../models/poll'),
    pollService = require('../services/poll');

module.exports.actions = function (req, res, ss) {
  req.use('session');
  
  var rpc = {
    get: function (dateString) {
      pollService.getPoll(dateString, function (err, poll) {
        if (err) {
          res(false);
        } else {
          res(poll);
        }
      });
    },
    today: function () {
      res(todaysPoll);
    },
    vote: function (trackIndex) {
      var poll;
      
      if ('username' in req.session) {
        poll = getTodays();
        poll.incrementVote(req.session.username, trackIndex, 1, function (err) {
          if (err) {
            res(false);
          } else {
            res(true);
          }
        });
      } else {
        res(false);
      }
    },
    unvote: function (trackIndex) {
      var poll;
      
      if ('username' in req.session) {
        poll = getTodays();
        poll.decrementVote(req.session.username, trackIndex, 1, function (err) {
          if (err) {
            res(false);
          } else {
            res(true);
          }
        });
      } else {
        res(false);
      }
    }
  };
  
  return rpc;
};

// TODO: this is dumb
function getTodays() {
  return new Poll({ date: Poll.createDateString(new Date) });
}
