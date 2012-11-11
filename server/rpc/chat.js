module.exports.actions = function (req, res, ss) {
  req.use('session');
  
  var TIME_SEPARATOR = ':';
  
  var rpc = {
    send: function (message) {
      var date, payload, time;
      
      if (message && message.length > 0) {
        date = new Date;
        
        time = [
          pad(date.getHours()),
          pad(date.getMinutes()),
          pad(date.getSeconds())
        ].join(TIME_SEPARATOR);
        
        payload = {
          username: req.session.username,
          timestamp: time,
          contents: message.trim()
        };
        
        ss.publish.all('/chat/message', payload);
        return res(payload);
      } else {
        return res(false);
      }
    }
  };
  
  return rpc;
};

function pad(n) {
  n = String(n);
  return n.length === 1 ? '0' + n : n;
}
