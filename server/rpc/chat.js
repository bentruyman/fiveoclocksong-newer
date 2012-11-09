module.exports.actions = function (req, res, ss) {
  req.use('session');
  
  return {
    send: function (message) {
      if (message && message.length > 0) {
        ss.publish.all('/chat/new-message', message);
        return res(true);
      } else {
        return res(false);
      }
    }
  };
};

var foo = new Date;
