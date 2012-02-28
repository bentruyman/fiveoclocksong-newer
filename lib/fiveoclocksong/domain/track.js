var _ = require('underscore');

var Track = module.exports = function (data) {
  this.key    = data.key;
  this.icon   = data.icon;
  this.album  = data.album;
  this.name   = data.name;
  this.artist = data.artist;
};
