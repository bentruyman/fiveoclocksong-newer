var Poll = require('../models/poll');

module.exports.actions = function (req, res, ss) {
  req.use('session');
  
  function getTodays(callback) {
    Poll.findOne({ date: Poll.today() }, callback);
  }
  
  var rpc = {
    get: function (dateString) {
      Poll.findOne({ date: dateString }, function (err, poll) {
        if (err) {
          res(false);
        } else {
          res(poll);
        }
      });
    },
    today: function () {
      getTodays(function (err, poll) {
        if (err) {
          res(false);
        } else {
          res(poll);
        }
      })
    },
    upvote: function (trackIndex) {
      if ('username' in req.session) {
        getTodays(function (err, poll) {
          if (poll) {
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
        });
      }
    },
    
    downvote: function (trackIndex) {
      if ('username' in req.session) {
        getTodays(function (err, poll) {
          if (poll) {
            poll.decrementVote(req.session.username, trackIndex, 1, function (err) {
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
        });
      }
    }
  };
  
  return rpc;
};

// TODO: this is dumb
function getTodays() {
  return new Poll({ date: Poll.createDateString(new Date) });
}
