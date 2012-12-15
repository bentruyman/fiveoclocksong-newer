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
      rpc.get(Poll.createDateString(new Date));
    },
    upvote: function (trackIndex) {
      var poll;
      
      if ('username' in req.session) {
        poll = getTodays();
        poll.incrementVote(req.session.username, trackIndex, 1, function (err) {
          if (err) {
            res(false);
          } else {
            ss.publish.all('/poll/upvote', trackIndex);
            res(true);
          }
        });
      } else {
        res(false);
      }
    },
    downvote: function (trackIndex) {
      var poll;
      
      if ('username' in req.session) {
        poll = getTodays();
        poll.decrementVote(req.session.username, trackIndex, 1, function (err) {
          if (err) {
            res(false);
          } else {
            ss.publish.all('/poll/downvote', trackIndex);
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
