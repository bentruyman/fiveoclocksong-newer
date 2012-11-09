var Poll = require('../models/poll'),
    pollService = require('../services/poll');

module.exports.actions = function (req, res, ss) {
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
    vote: function (trackIndex) {
      
    },
    unvote: function (trackIndex) {
      
    }
  };
  
  return rpc;
};
