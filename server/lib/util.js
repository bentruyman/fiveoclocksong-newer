module.exports = {
  namespace: function () {
    return Array.prototype.slice(arguments).join(':');
  }
};
