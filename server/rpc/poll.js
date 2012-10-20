var pollService = require('../services/poll');

module.exports.actions = function (req, res, ss) {
  return {
    get: function (dateString) {
      pollService.getPoll(dateString, function (err, poll) {
        if (err) {
          res(false);
        } else {
          res(poll);
        }
      });
    },
    vote: function (trackIndex) {
      
    },
    unvote: function (trackIndex) {
      
    }
  };
};
