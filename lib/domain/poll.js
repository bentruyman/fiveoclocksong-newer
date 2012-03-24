var _ = require('underscore');

var Poll = module.exports = function (data) {
  _.extend(this, { tracks: [] }, data);
};

// force poll type
Object.defineProperty(Poll.prototype, 'type', {
  value: 'poll',
  writable: false
});

Poll.prototype.toJSON = function () {
  var poll = {};
  
  if (this._id)  { poll._id  = this._id; }
  if (this._rev) { poll._rev = this._rev; }
  
  poll.type   = this.type;
  poll.date   = this.date;
  poll.tracks = this.tracks;
  
  return poll;
};
