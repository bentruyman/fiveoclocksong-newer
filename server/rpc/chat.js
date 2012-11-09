module.exports.actions = function (req, res, ss) {
  req.use('session');
  
  var rpc = {
    send: function (message) {
      if (message && message.length > 0) {
        ss.publish.all('/chat/new-message', message);
        return res(true);
      } else {
        return res(false);
      }
    }
  };
  
  return rpc;
};

var foo = new Date;
