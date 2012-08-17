var ldap = require('ldapjs');

var config = require('../config');

module.exports = {
  getClient: function () {
    return ldap.createClient({ url: config.ldap.url });
  }
};
